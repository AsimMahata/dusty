use std::path::PathBuf;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use crate::dusty::models::shows::ShowResult;
use crate::dusty::p2p::OutgoingRequestState;
use crate::dusty::p2p::TransferItem;

pub fn get_stash_file_path() -> Result<PathBuf, String> {
    Ok(get_stash_dir()?.join("outgoing_request.json"))
}

pub fn get_stash_dir() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or_else(|| "FAILED_TO_GET_HOME_DIR".to_string())?;
    Ok(home.join(".dusty").join("user").join("p2p").join("stash"))
}

pub fn save_outgoing_request_to_stash(req: &OutgoingRequestState) -> Result<(), String> {
    let stash_dir = get_stash_dir()?;
    if let Err(e) = std::fs::create_dir_all(&stash_dir) {
        log::error!(
            "[P2P Stash] Failed to create stash directory '{:?}': {}",
            stash_dir,
            e
        );
        return Err(format!("Failed to create stash directory: {}", e));
    }
    let file_path = get_stash_file_path()?;
    let json_data = serde_json::to_string_pretty(req).map_err(|e| e.to_string())?;
    std::fs::write(&file_path, json_data).map_err(|e| {
        log::error!(
            "[P2P Stash] Failed to write stash file '{:?}': {}",
            file_path,
            e
        );
        format!("Failed to write stash file: {}", e)
    })?;
    log::info!(
        "[P2P Stash] Saved outgoing request (status: {}) to {:?}",
        req.status,
        file_path
    );
    Ok(())
}

pub fn load_outgoing_request_from_stash() -> Option<OutgoingRequestState> {
    if let Ok(file_path) = get_stash_file_path() {
        if !file_path.exists() {
            return None;
        }
        let data = match std::fs::read_to_string(&file_path) {
            Ok(d) => d,
            Err(e) => {
                log::warn!(
                    "[P2P Stash] Failed to read stash file '{:?}': {}",
                    file_path,
                    e
                );
                return None;
            }
        };
        return match serde_json::from_str::<OutgoingRequestState>(&data) {
            Ok(req) => Some(req),
            Err(e) => {
                log::warn!(
                    "[P2P Stash] Failed to parse stash file JSON: {}. Clearing corrupted stash...",
                    e
                );
                clear_outgoing_request_stash();
                None
            }
        };
    }
    return None;
}

pub fn clear_outgoing_request_stash() {
    if let Ok(file_path) = get_stash_file_path() {
        if file_path.exists() {
            if let Err(e) = std::fs::remove_file(&file_path) {
                log::warn!(
                    "[P2P Stash] Failed to remove stash file '{:?}': {}",
                    file_path,
                    e
                );
            } else {
                log::info!("[P2P Stash] Cleared outgoing request stash file");
            }
        }
    }
}

pub fn add_file_to_stash(path: String) -> Result<OutgoingRequestState, String> {
    let mut req = match load_outgoing_request_from_stash() {
        Some(existing) if existing.status == "STASHED" => existing,
        _ => {
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            OutgoingRequestState {
                id: uuid::Uuid::new_v4().to_string(),
                files: Vec::new(),
                items: Vec::new(),
                status: "STASHED".to_string(),
                created_at: now,
                timeout_secs: 60,
                receiver_name: None,
            }
        }
    };

    let already_added = req.items.iter().any(|item| match item {
        TransferItem::File { path: p } => p == &path,
        _ => false,
    });

    if !already_added {
        req.items.push(TransferItem::File { path: path.clone() });
        if !req.files.contains(&path) {
            req.files.push(path);
        }
    }
    save_outgoing_request_to_stash(&req)?;
    Ok(req)
}

pub fn add_show_to_stash(show: ShowResult) -> Result<OutgoingRequestState, String> {
    let mut req = match load_outgoing_request_from_stash() {
        Some(existing) if existing.status == "STASHED" => existing,
        _ => {
            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);
            OutgoingRequestState {
                id: uuid::Uuid::new_v4().to_string(),
                files: Vec::new(),
                items: Vec::new(),
                status: "STASHED".to_string(),
                created_at: now,
                timeout_secs: 60,
                receiver_name: None,
            }
        }
    };

    let already_added = req.items.iter().any(|item| match item {
        TransferItem::Show { show: s } => s.id == show.id,
        _ => false,
    });

    if !already_added {
        for ep in &show.episodes {
            let p = ep.path.to_string_lossy().to_string();
            if !req.files.contains(&p) {
                req.files.push(p);
            }
        }
        req.items.push(TransferItem::Show { show });
    }
    save_outgoing_request_to_stash(&req)?;
    Ok(req)
}
