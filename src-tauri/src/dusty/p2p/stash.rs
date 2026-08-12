use std::path::PathBuf;

use crate::dusty::p2p::OutgoingRequestState;

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
                log::warn!("[P2P Stash] Failed to parse stash file JSON: {}", e);
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
