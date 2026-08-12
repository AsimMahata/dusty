use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use tauri::Manager;

use crate::dusty::config::get_user_info;
use crate::dusty::models::state::AppState;
use crate::dusty::multithreading::temp_workers;


use crate::dusty::p2p::check_for_already_transfering;
use crate::dusty::p2p::check_for_existing_outgoing_stash_and_request_status;
use crate::dusty::p2p::clear_outgoing_request_stash;
use crate::dusty::p2p::get_my_peer_with_ip;
use crate::dusty::p2p::get_valid_files;
use crate::dusty::p2p::load_outgoing_request_from_stash;
use crate::dusty::p2p::make_new_outgoing_send_request;
use crate::dusty::p2p::save_outgoing_request_to_stash;
use crate::dusty::p2p::seach_for_available_senders;
use crate::dusty::p2p::select_files_using_window;
use crate::dusty::p2p::set_transfer_cancelled;
use crate::dusty::p2p::start_p2p_receiver;
use crate::dusty::p2p::start_p2p_sender;
use crate::dusty::p2p::P2PCurrentState;
use crate::dusty::p2p::PendingTransfer;
use crate::dusty::p2p::P2P_STATE;

#[tauri::command]
pub fn get_p2p_state() -> Result<P2PCurrentState, String> {
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
            save_outgoing_request_to_stash(req)?;
        }
    }

    let mode = if state.active_transfer.is_some() {
        "transfer".to_string()
    } else if state.mode.is_empty() {
        "send".to_string()
    } else {
        state.mode.clone()
    };

    Ok(P2PCurrentState {
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
pub async fn get_pending_transfers() -> Result<Vec<PendingTransfer>, String> {
    tokio::task::spawn_blocking(move || {
        let results = temp_workers(vec![move || {
            let state = P2P_STATE.lock().map_err(|e| e.to_string())?;

            let now = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_secs())
                .unwrap_or(0);

            let valid_transfers: Vec<PendingTransfer> = state
                .pending_transfers
                .iter()
                .filter(|t| now < t.created_at + t.timeout_secs)
                .cloned()
                .collect();

            Ok(valid_transfers)
        }]);
        results
            .into_iter()
            .next()
            .unwrap_or_else(|| Err("Temp worker execution failed".to_string()))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn accept_transfer(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    check_for_already_transfering()?;
    let me = get_my_peer_with_ip()?;
    set_transfer_cancelled(false);

    log::info!(
        "[P2P API] accept_transfer called for id: {}, receiver peer: {:?}",
        id,
        me
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

            if let Err(e) = start_p2p_receiver(pending, me) {
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
pub async fn reject_transfer(id: String) -> Result<(), String> {
    log::info!("[P2P API] reject_transfer called for id: {}", id);
    tokio::task::spawn_blocking(move || {
        let results = temp_workers(vec![move || {
            let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
            state.pending_transfers.retain(|t| t.id != id);
            Ok::<(), String>(())
        }]);
        results
            .into_iter()
            .next()
            .unwrap_or_else(|| Err("Temp worker execution failed".to_string()))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn cancel_transfer() -> Result<(), String> {
    log::info!("[P2P API] cancel_transfer called");
    set_transfer_cancelled(true);
    clear_outgoing_request_stash();

    tokio::task::spawn_blocking(move || {
        let results = temp_workers(vec![move || {
            let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
            let previous_role = state.active_transfer.as_ref().map(|a| a.role.clone());
            state.active_transfer = None;
            if let Some(role) = previous_role {
                state.mode = if role == "receiver" {
                    "receive".to_string()
                } else {
                    "send".to_string()
                };
            } else {
                state.mode = "send".to_string();
            }
            Ok::<(), String>(())
        }]);
        results
            .into_iter()
            .next()
            .unwrap_or_else(|| Err("Temp worker execution failed".to_string()))
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub fn start_send(app_handle: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    set_transfer_cancelled(false);
    check_for_existing_outgoing_stash_and_request_status()?;
    let outgoing_req = make_new_outgoing_send_request(files)?;
    save_outgoing_request_to_stash(&outgoing_req)?;
    let me = get_user_info().map_err(|e| e.to_user_message())?;

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
    let files = select_files_using_window();
    get_valid_files(files)
}
