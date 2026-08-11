use local_ip_address::local_ip;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::Manager;

use crate::dusty::{
    api::{seach_for_available_senders, start_p2p_receiver, start_p2p_sender, Peer},
    config::get_user_info,
    models::state::AppState,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferFileProgress {
    pub name: String,
    pub progress: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveTransfer {
    pub id: String,
    pub sender_name: String,
    pub receiver_name: String,
    pub files: Vec<TransferFileProgress>,
    pub overall_progress: f64,
    pub status: String,
    pub role: String,
    pub total_time_secs: Option<f64>,
    pub destination_path: Option<String>,
    pub total_bytes: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutgoingRequestState {
    pub id: String,
    pub files: Vec<String>,
    pub status: String,
    pub created_at: u64,
    pub timeout_secs: u64,
    pub receiver_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct P2PBackendState {
    pub mode: String, // "send", "receive", or "transfer"
    pub active_transfer: Option<ActiveTransfer>,
    pub outgoing_request: Option<OutgoingRequestState>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PendingTransfer {
    pub id: String,
    pub sender_name: String,
    pub sender_ips: Vec<String>,
    pub sender_port: u16,
    pub files: Vec<String>,
}

pub(crate) struct InternalP2PState {
    pub mode: String,
    pub active_transfer: Option<ActiveTransfer>,
    pub pending_transfers: Vec<PendingTransfer>,
}

pub(crate) static CANCEL_FLAG: std::sync::atomic::AtomicBool =
    std::sync::atomic::AtomicBool::new(false);

pub fn is_transfer_cancelled() -> bool {
    CANCEL_FLAG.load(std::sync::atomic::Ordering::Relaxed)
}

pub fn set_transfer_cancelled(val: bool) {
    CANCEL_FLAG.store(val, std::sync::atomic::Ordering::Relaxed);
}

pub(crate) static P2P_STATE: Mutex<InternalP2PState> = Mutex::new(InternalP2PState {
    mode: String::new(),
    active_transfer: None,
    pending_transfers: Vec::new(),
});

pub fn get_stash_dir() -> PathBuf {
    let home = dirs::home_dir().unwrap_or_else(|| PathBuf::from("."));
    home.join(".dusty").join("user").join("p2p").join("stash")
}

pub fn get_stash_file_path() -> PathBuf {
    get_stash_dir().join("outgoing_request.json")
}

pub fn save_outgoing_request_to_stash(req: &OutgoingRequestState) -> Result<(), String> {
    let stash_dir = get_stash_dir();
    if let Err(e) = std::fs::create_dir_all(&stash_dir) {
        log::error!(
            "[P2P Stash] Failed to create stash directory '{:?}': {}",
            stash_dir,
            e
        );
        return Err(format!("Failed to create stash directory: {}", e));
    }
    let file_path = get_stash_file_path();
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
    let file_path = get_stash_file_path();
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
    match serde_json::from_str::<OutgoingRequestState>(&data) {
        Ok(req) => Some(req),
        Err(e) => {
            log::warn!("[P2P Stash] Failed to parse stash file JSON: {}", e);
            None
        }
    }
}

pub fn clear_outgoing_request_stash() {
    let file_path = get_stash_file_path();
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

#[tauri::command]
pub fn get_p2p_state() -> Result<P2PBackendState, String> {
    let state = P2P_STATE.lock().map_err(|e| e.to_string())?;

    let mut outgoing = load_outgoing_request_from_stash();
    if let Some(ref mut req) = outgoing {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        if (req.status == "WAITING_FOR_ACCEPTANCE" || req.status == "REQUEST_SENT")
            && now >= req.created_at + req.timeout_secs
        {
            req.status = "TIMED_OUT".to_string();
            let _ = save_outgoing_request_to_stash(req);
        }
    }

    let mode = if state.active_transfer.is_some() {
        "transfer".to_string()
    } else if state.mode.is_empty() {
        "send".to_string()
    } else {
        state.mode.clone()
    };

    Ok(P2PBackendState {
        mode,
        active_transfer: state.active_transfer.clone(),
        outgoing_request: outgoing,
    })
}

#[tauri::command]
pub async fn search_for_senders(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<PendingTransfer>, String> {
    let (tx, rx) = tokio::sync::oneshot::channel::<Vec<PendingTransfer>>();
    state
        .p2p_worker
        .dispatch(|| {
            seach_for_available_senders(tx);
        })
        .map_err(|_| "Failed to dispatch sender".to_string())?;
    let senders = rx
        .await
        .map_err(|_| "Failed to receive senders".to_string())?;
    Ok(senders)
}

#[tauri::command]
pub fn get_pending_transfers() -> Result<Vec<PendingTransfer>, String> {
    let state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    Ok(state.pending_transfers.clone())
}

#[tauri::command]
pub fn accept_transfer(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    if state.mode == "transfer" || state.active_transfer.is_some() {
        log::warn!(
            "[P2P API] Transfer already in progress. Ignoring duplicate accept_transfer call."
        );
        return Ok(());
    }
    state.mode = "transfer".to_string();
    drop(state);

    let me = get_user_info(&app_handle).map_err(|e| e.to_user_message())?;
    let mut me_peer = Peer::peer_automatic_ip_address(
        me.id.parse().map_err(|e: uuid::Error| e.to_string())?,
        me.display_name.clone(),
        me.hostname.clone(),
        super::RECEIVER_TRANSFER_PORT,
    );
    if let Ok(ip) = local_ip() {
        me_peer.add_address(ip.to_string());
    } else {
        return Err("Failed to get local IP address".to_string());
    }

    set_transfer_cancelled(false);
    log::info!(
        "[P2P API] accept_transfer called for id: {}, receiver peer: {:?}",
        id,
        me_peer
    );

    app_handle
        .state::<AppState>()
        .p2p_worker
        .dispatch(move || {
            let state = match P2P_STATE.lock() {
                Ok(s) => s,
                Err(e) => {
                    log::error!("[P2P API] Failed to lock P2P_STATE: {}", e);
                    return;
                }
            };
            let pending = match state.pending_transfers.iter().find(|t| t.id == id).cloned() {
                Some(p) => p,
                None => {
                    log::error!("[P2P API] Pending transfer not found for id: {}", id);
                    return;
                }
            };
            drop(state);

            if let Err(e) = start_p2p_receiver(pending, me_peer) {
                log::error!(
                    "[P2P API] Receiver task failed for transfer '{}': {}",
                    id,
                    e
                );
            }
        })
        .map_err(|_| "Failed to dispatch receiver".to_string())
}

#[tauri::command]
pub fn reject_transfer(id: String) -> Result<(), String> {
    log::info!("[P2P API] reject_transfer called for id: {}", id);
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.pending_transfers.retain(|t| t.id != id);
    Ok(())
}

#[tauri::command]
pub fn cancel_transfer() -> Result<(), String> {
    log::info!("[P2P API] cancel_transfer called");
    set_transfer_cancelled(true);
    clear_outgoing_request_stash();
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    let previous_role = state.active_transfer.as_ref().map(|a| a.role.clone());
    state.active_transfer = None;
    if let Some(role) = previous_role {
        state.mode = if role == "receiver" { "receive".to_string() } else { "send".to_string() };
    } else {
        state.mode = "send".to_string();
    }
    Ok(())
}

#[tauri::command]
pub fn start_send(app_handle: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    set_transfer_cancelled(false);

    if let Some(existing) = load_outgoing_request_from_stash() {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        let is_expired = now >= existing.created_at + existing.timeout_secs;
        if (existing.status == "WAITING_FOR_ACCEPTANCE"
            || existing.status == "REQUEST_SENT"
            || existing.status == "ACCEPTED"
            || existing.status == "INITIALIZING_TRANSFER")
            && !is_expired
        {
            return Err("An active outgoing request already exists. Please cancel or wait for timeout before creating a new request.".to_string());
        }
    }

    let me = get_user_info(&app_handle).map_err(|e| e.to_user_message())?;
    log::info!("[P2P API] start_send called with files: {:#?}", files);

    let transfer_key = uuid::Uuid::new_v4().to_string();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let outgoing_req = OutgoingRequestState {
        id: transfer_key,
        files,
        status: "WAITING_FOR_ACCEPTANCE".to_string(),
        created_at: now,
        timeout_secs: 60,
        receiver_name: None,
    };

    save_outgoing_request_to_stash(&outgoing_req)?;

    let req_to_dispatch = outgoing_req.clone();
    app_handle
        .state::<AppState>()
        .p2p_worker
        .dispatch(move || {
            if let Err(e) = start_p2p_sender(req_to_dispatch, me) {
                log::error!("[P2P API] start_p2p_sender failed: {}", e);
            }
        })
        .map_err(|_| "Failed to dispatch sender".to_string())
}

#[tauri::command]
pub fn select_send_files() -> Result<Vec<String>, String> {
    log::info!("[P2P API] select_send_files called");

    let files = rfd::FileDialog::new()
        .set_title("Select Files to Send")
        .add_filter("All Files", &["*"])
        .pick_files();

    match files {
        Some(paths) => {
            let mut valid_files = Vec::new();
            for path in paths {
                if !path.exists() {
                    return Err(format!("File does not exist: {}", path.display()));
                }
                if !path.is_file() {
                    return Err(format!("Path is not a file: {}", path.display()));
                }
                if let Err(e) = std::fs::metadata(&path) {
                    return Err(format!(
                        "Cannot read file metadata for {}: {}",
                        path.display(),
                        e
                    ));
                }

                let path_str = path
                    .to_str()
                    .ok_or_else(|| format!("File path is not valid UTF-8: {}", path.display()))?;
                valid_files.push(path_str.to_string());
            }
            log::info!("[P2P API] Selected {} valid file(s)", valid_files.len());
            Ok(valid_files)
        }
        None => {
            log::info!("[P2P API] File selection cancelled by user");
            Ok(vec![])
        }
    }
}
