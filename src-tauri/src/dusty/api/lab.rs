use crate::dusty::data::state::AppState;
use crate::dusty::engine::utility::parser::tokenize_string;
use serde_json::{Map, Value};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub fn tokenize(input: String) -> Vec<String> {
    tokenize_string(&input)
}

#[tauri::command]
pub fn get_all_table_data(
    state: State<'_, AppState>,
) -> Result<HashMap<String, Vec<Map<String, Value>>>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    let tables = state.tables.clone();
    let mut result = HashMap::new();

    for table in tables {
        let mut stmt = conn
            .prepare(&format!("SELECT * FROM {}", table))
            .map_err(|e| e.to_string())?;
        let column_names: Vec<String> = stmt.column_names().into_iter().map(String::from).collect();

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
}
