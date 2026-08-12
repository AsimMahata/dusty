use crate::dusty::engine::utility::tokenizer::tokenize_string;
use crate::dusty::models::state::AppState;
use serde::Serialize;
use serde_json::Map;
use serde_json::Value;
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::io::Seek;
use std::io::SeekFrom;
use std::path::PathBuf;
use tauri::Manager;
use tauri::State;

#[derive(Serialize)]
pub struct LogReadResult {
    pub content: String,
    pub next_offset: u64,
    pub total_bytes: u64,
    pub log_path: String,
}

#[tauri::command]
pub fn tokenize(input: String) -> Vec<String> {
    tokenize_string(&input)
}

#[tauri::command]
pub fn get_experiment_log_path(app: tauri::AppHandle) -> Result<String, String> {
    if let Ok(log_dir) = app.path().app_log_dir() {
        if let Ok(entries) = std::fs::read_dir(&log_dir) {
            let mut log_files: Vec<PathBuf> = entries
                .filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.is_file() && p.extension().and_then(|s| s.to_str()) == Some("log"))
                .collect();
            log_files.sort_by_key(|p| std::fs::metadata(p).and_then(|m| m.modified()).ok());
            if let Some(latest) = log_files.last() {
                return Ok(latest.to_string_lossy().to_string());
            }
        }
        let default_log = log_dir.join("dusty.log");
        return Ok(default_log.to_string_lossy().to_string());
    }
    Err("Could not resolve app log directory".to_string())
}

#[tauri::command]
pub fn get_experiment_log(
    app: tauri::AppHandle,
    path: Option<String>,
    from_byte: Option<u64>,
) -> Result<LogReadResult, String> {
    let log_path_str = match path {
        Some(p) if !p.trim().is_empty() => p,
        _ => get_experiment_log_path(app)?,
    };

    let path_buf = PathBuf::from(&log_path_str);
    if !path_buf.exists() {
        return Ok(LogReadResult {
            content: String::new(),
            next_offset: 0,
            total_bytes: 0,
            log_path: log_path_str,
        });
    }

    // std::fs::File::open uses FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE on Windows,
    // allowing non-locking reading while another process writes.
    let mut file = File::open(&path_buf).map_err(|e| format!("Failed to open log file: {}", e))?;
    let metadata = file
        .metadata()
        .map_err(|e| format!("Failed to read log metadata: {}", e))?;
    let total_bytes = metadata.len();

    let start_offset = match from_byte {
        Some(offset) if offset <= total_bytes => offset,
        _ => {
            // If starting fresh or file truncated, read up to last 64KB
            const MAX_INITIAL_READ: u64 = 65_536;
            if total_bytes > MAX_INITIAL_READ {
                total_bytes - MAX_INITIAL_READ
            } else {
                0
            }
        }
    };

    file.seek(SeekFrom::Start(start_offset))
        .map_err(|e| format!("Failed to seek log file: {}", e))?;

    let bytes_to_read = (total_bytes - start_offset) as usize;
    let mut buffer = vec![0u8; bytes_to_read];
    file.read_exact(&mut buffer)
        .map_err(|e| format!("Failed to read log content: {}", e))?;

    let content = String::from_utf8_lossy(&buffer).to_string();

    Ok(LogReadResult {
        content,
        next_offset: total_bytes,
        total_bytes,
        log_path: log_path_str,
    })
}

#[tauri::command]
pub async fn get_all_table_data(
    state: State<'_, AppState>,
) -> Result<HashMap<String, Vec<Map<String, Value>>>, String> {
    let tables = state.tables.clone();
    state
        .db_worker
        .run(move |conn| {
            let mut result = HashMap::new();

            for table in tables {
                let mut stmt = conn
                    .prepare(&format!("SELECT * FROM {}", table))
                    .map_err(|e| e.to_string())?;
                let column_names: Vec<String> =
                    stmt.column_names().into_iter().map(String::from).collect();

                let rows = stmt
                    .query_map([], |row| {
                        let mut map = Map::new();
                        for (i, name) in column_names.iter().enumerate() {
                            let val_ref = row.get_ref(i)?;
                            let val = match val_ref {
                                rusqlite::types::ValueRef::Null => Value::Null,
                                rusqlite::types::ValueRef::Integer(i) => {
                                    Value::Number(serde_json::Number::from(i))
                                }
                                rusqlite::types::ValueRef::Real(r) => {
                                    if let Some(n) = serde_json::Number::from_f64(r) {
                                        Value::Number(n)
                                    } else {
                                        Value::Null
                                    }
                                }
                                rusqlite::types::ValueRef::Text(t) => {
                                    Value::String(String::from_utf8_lossy(t).to_string())
                                }
                                rusqlite::types::ValueRef::Blob(b) => {
                                    Value::String(format!("<Blob {} bytes>", b.len()))
                                }
                            };
                            map.insert(name.clone(), val);
                        }
                        Ok(Value::Object(map))
                    })
                    .map_err(|e| e.to_string())?;

                let mut table_data = Vec::new();
                for row in rows {
                    if let Ok(Value::Object(map)) = row {
                        table_data.push(map);
                    }
                }
                result.insert(table, table_data);
            }

            Ok(result)
        })
        .await
        .map_err(|e| e)?
}
