use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferFileProgress {
    pub name: String,
    pub progress: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveTransfer {
    pub id: String,
    pub sender_name: String,
    pub files: Vec<TransferFileProgress>,
    pub overall_progress: f64,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct P2PBackendState {
    pub mode: String, // "send", "receive", or "transfer"
    pub active_transfer: Option<ActiveTransfer>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PendingTransfer {
    pub id: String,
    pub sender_name: String,
    pub files: Vec<String>,
}

struct InternalP2PState {
    mode: String,
    active_transfer: Option<ActiveTransfer>,
    pending_transfers: Vec<PendingTransfer>,
}

static P2P_STATE: Mutex<InternalP2PState> = Mutex::new(InternalP2PState {
    mode: String::new(),
    active_transfer: None,
    pending_transfers: Vec::new(),
});

#[command]
pub fn get_p2p_state() -> Result<P2PBackendState, String> {
    let state = P2P_STATE.lock().map_err(|e| e.to_string())?;
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
    })
}

#[command]
pub fn select_send_files() -> Result<Vec<String>, String> {
    log::info!("[P2P API] select_send_files called");
    Ok(vec![])
}

#[command]
pub fn start_send(files: Vec<String>) -> Result<(), String> {
    log::info!("[P2P API] start_send called with files: {:?}", files);
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.mode = "transfer".to_string();
    state.active_transfer = Some(ActiveTransfer {
        id: "tx-send-1".to_string(),
        sender_name: "Me (Sending)".to_string(),
        files: files
            .iter()
            .map(|f| TransferFileProgress {
                name: f.clone(),
                progress: 45.0,
            })
            .collect(),
        overall_progress: 45.0,
        status: "in_progress".to_string(),
    });
    Ok(())
}

#[command]
pub fn search_for_senders() -> Result<Vec<PendingTransfer>, String> {
    log::info!("[P2P API] search_for_senders called");
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    let mock_list = vec![
        PendingTransfer {
            id: "req-101".to_string(),
            sender_name: "Asim's Laptop".to_string(),
            files: vec!["movie.mkv".to_string(), "song.mp3".to_string()],
        },
        PendingTransfer {
            id: "req-102".to_string(),
            sender_name: "Another Device".to_string(),
            files: vec!["photos.zip".to_string()],
        },
    ];
    state.pending_transfers = mock_list.clone();
    Ok(mock_list)
}

#[command]
pub fn get_pending_transfers() -> Result<Vec<PendingTransfer>, String> {
    let state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    Ok(state.pending_transfers.clone())
}

#[command]
pub fn accept_transfer(id: String) -> Result<(), String> {
    log::info!("[P2P API] accept_transfer called for id: {}", id);
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    let target = state.pending_transfers.iter().find(|t| t.id == id).cloned();

    let sender_name = target
        .as_ref()
        .map(|t| t.sender_name.clone())
        .unwrap_or_else(|| "Asim's Laptop".to_string());
    let files = target
        .as_ref()
        .map(|t| t.files.clone())
        .unwrap_or_else(|| vec!["movie.mkv".to_string(), "song.mp3".to_string()]);

    state.mode = "transfer".to_string();
    state.active_transfer = Some(ActiveTransfer {
        id,
        sender_name,
        files: files
            .into_iter()
            .enumerate()
            .map(|(idx, name)| TransferFileProgress {
                name,
                progress: if idx == 0 { 68.0 } else { 100.0 },
            })
            .collect(),
        overall_progress: 72.0,
        status: "in_progress".to_string(),
    });
    Ok(())
}

#[command]
pub fn reject_transfer(id: String) -> Result<(), String> {
    log::info!("[P2P API] reject_transfer called for id: {}", id);
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.pending_transfers.retain(|t| t.id != id);
    Ok(())
}

#[command]
pub fn cancel_transfer() -> Result<(), String> {
    log::info!("[P2P API] cancel_transfer called");
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.active_transfer = None;
    state.mode = "receive".to_string();
    Ok(())
}
