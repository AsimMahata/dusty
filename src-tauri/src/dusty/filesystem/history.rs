use crate::dusty::logger::logger;
use crate::dusty::multithreading::BackgroundWorker;
use chrono::Utc;
use serde::Deserialize;
use serde::Serialize;
use std::fs;
use std::path::Path;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DeletedEntry {
    pub path: String,
    pub name: String,
    pub extension: Option<String>,
    pub size: u64,
    pub deleted_at: String,
    pub is_directory: bool,
    pub created: Option<u64>,
    pub modified: Option<u64>,
}

pub fn record_deletion_async(
    app_local_data_dir: PathBuf,
    target_path: &Path,
    background_worker: &BackgroundWorker,
) {
    let metadata_res = fs::metadata(target_path);

    let is_directory = target_path.is_dir();
    let name = target_path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("")
        .to_string();

    let extension = if !is_directory {
        target_path
            .extension()
            .and_then(|e| e.to_str())
            .map(|ext| format!(".{}", ext))
    } else {
        None
    };

    let size = metadata_res.as_ref().map(|m| m.len()).unwrap_or(0);

    let created = metadata_res
        .as_ref()
        .ok()
        .and_then(|m| m.created().ok())
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| d.as_secs());

    let modified = metadata_res
        .as_ref()
        .ok()
        .and_then(|m| m.modified().ok())
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| d.as_secs());

    let deleted_at = Utc::now().to_rfc3339();

    let entry = DeletedEntry {
        path: target_path.to_string_lossy().to_string(),
        name,
        extension,
        size,
        deleted_at,
        is_directory,
        created,
        modified,
    };

    background_worker.dispatch("RECORD_DELETION", move || {
        let history_dir = app_local_data_dir.join("history");
        if let Err(e) = fs::create_dir_all(&history_dir) {
            logger::error!("CREATE_HISTORY_DIR_FAILED", format!("{:?}", e));
            return;
        }

        let history_file = history_dir.join("deleted.json");

        let mut entries: Vec<DeletedEntry> = if history_file.exists() {
            fs::read_to_string(&history_file)
                .ok()
                .and_then(|content| serde_json::from_str(&content).ok())
                .unwrap_or_default()
        } else {
            Vec::new()
        };

        entries.push(entry);

        if let Ok(json_content) = serde_json::to_string_pretty(&entries) {
            if let Err(e) = fs::write(&history_file, json_content) {
                logger::error!("WRITE_DELETED_JSON_FAILED", format!("{:?}", e));
            }
        }
    });
}
