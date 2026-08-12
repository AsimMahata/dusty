use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::dusty::p2p::TransferItem;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct P2PTransferHistoryRecord {
    pub id: String,
    pub direction: String, // "outgoing" | "incoming"
    pub role: String,      // "sender" | "receiver"
    pub items: Vec<TransferItem>,
    pub files: Vec<String>,
    pub peer_name: String,
    pub peer_ip: Option<String>,
    pub started_at: u64,
    pub completed_at: u64,
    pub status: String, // "COMPLETED" | "CANCELLED" | "FAILED" | "TIMED_OUT"
    pub failure_reason: Option<String>,
    pub total_bytes: Option<u64>,
    pub duration_secs: Option<f64>,
}

pub fn get_history_dir() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or_else(|| "FAILED_TO_GET_HOME_DIR".to_string())?;
    Ok(home.join(".dusty").join("user").join("p2p").join("history"))
}

pub fn get_history_file_path() -> Result<PathBuf, String> {
    Ok(get_history_dir()?.join("transfer.json"))
}

pub fn record_p2p_history_async(record: P2PTransferHistoryRecord) {
    std::thread::spawn(move || {
        if let Ok(dir) = get_history_dir() {
            if let Err(e) = fs::create_dir_all(&dir) {
                log::error!("[P2P History] Failed to create history directory '{:?}': {}", dir, e);
                return;
            }
            if let Ok(file_path) = get_history_file_path() {
                let mut entries: Vec<P2PTransferHistoryRecord> = if file_path.exists() {
                    fs::read_to_string(&file_path)
                        .ok()
                        .and_then(|data| serde_json::from_str(&data).ok())
                        .unwrap_or_default()
                } else {
                    Vec::new()
                };

                entries.push(record.clone());

                if let Ok(json_str) = serde_json::to_string_pretty(&entries) {
                    if let Err(e) = fs::write(&file_path, json_str) {
                        log::error!("[P2P History] Failed to write history file '{:?}': {}", file_path, e);
                    } else {
                        log::info!(
                            "[P2P History] Recorded transfer history entry: id={}, role={}, status={}",
                            record.id,
                            record.role,
                            record.status
                        );
                    }
                }
            }
        }
    });
}

pub fn create_and_record_history(
    id: String,
    direction: String,
    role: String,
    items: Vec<TransferItem>,
    files: Vec<String>,
    peer_name: String,
    peer_ip: Option<String>,
    started_at: u64,
    status: String,
    failure_reason: Option<String>,
    total_bytes: Option<u64>,
    duration_secs: Option<f64>,
) {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let record = P2PTransferHistoryRecord {
        id,
        direction,
        role,
        items,
        files,
        peer_name,
        peer_ip,
        started_at,
        completed_at: now,
        status,
        failure_reason,
        total_bytes,
        duration_secs,
    };

    record_p2p_history_async(record);
}

pub fn load_p2p_history() -> Vec<P2PTransferHistoryRecord> {
    if let Ok(file_path) = get_history_file_path() {
        if file_path.exists() {
            if let Ok(data) = fs::read_to_string(&file_path) {
                if let Ok(records) = serde_json::from_str::<Vec<P2PTransferHistoryRecord>>(&data) {
                    return records;
                }
            }
        }
    }
    Vec::new()
}
