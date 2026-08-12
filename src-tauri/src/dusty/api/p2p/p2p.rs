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
use crate::dusty::p2p::OutgoingRequestState;
use crate::dusty::p2p::P2PCurrentState;
use crate::dusty::p2p::PendingTransfer;
use crate::dusty::p2p::P2P_STATE;


#[tauri::command]
pub async fn get_p2p_state() -> Result<P2PCurrentState, String> {
    tokio::task::spawn_blocking(move || {
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
    })
    .await
    .map_err(|e| e.to_string())?
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
            let mut state = match P2P_STATE.lock() {
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

            if pending.sender_port == 0 {
                log::info!("[P2P API] Accepting manual direct-IP transfer '{}'", id);
                let me_name = me.name().to_string();
                let files_progress = pending
                    .files
                    .iter()
                    .map(|f| crate::dusty::p2p::models::TransferFileProgress {
                        name: f.clone(),
                        progress: 0.0,
                    })
                    .collect();

                state.mode = "transfer".to_string();
                state.active_transfer = Some(crate::dusty::p2p::models::ActiveTransfer {
                    id: pending.id.clone(),
                    sender_name: pending.sender_name.clone(),
                    receiver_name: me_name,
                    files: files_progress,
                    overall_progress: 0.0,
                    status: "in_progress".to_string(),
                    role: "receiver".to_string(),
                    total_time_secs: None,
                    destination_path: None,
                    total_bytes: None,
                    speed_bytes_per_sec: 0.0,
                });
                state.pending_transfers.retain(|t| t.id != id);
                drop(state);
                return;
            }
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
    if let Some(req) = load_outgoing_request_from_stash() {
        if req.status == "WAITING_FOR_ACCEPTANCE"
            || req.status == "REQUEST_SENT"
            || req.status == "ACCEPTED"
            || req.status == "INITIALIZING_TRANSFER"
        {
            crate::dusty::p2p::history::create_and_record_history(
                req.id.clone(),
                "outgoing".to_string(),
                "sender".to_string(),
                req.get_items(),
                req.all_file_paths(),
                req.receiver_name.unwrap_or_else(|| "Unknown Receiver".to_string()),
                None,
                req.created_at,
                "CANCELLED".to_string(),
                Some("Request cancelled by sender".to_string()),
                None,
                None,
            );
        }
    }
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
pub async fn start_send(app_handle: tauri::AppHandle, files: Vec<String>) -> Result<(), String> {
    set_transfer_cancelled(false);

    let (req_to_dispatch, me) = tokio::task::spawn_blocking(move || {
        let outgoing_req = if files.is_empty() {
            if let Some(mut stashed) = load_outgoing_request_from_stash() {
                let now = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .map(|d| d.as_secs())
                    .unwrap_or(0);
                stashed.status = "WAITING_FOR_ACCEPTANCE".to_string();
                stashed.created_at = now;
                save_outgoing_request_to_stash(&stashed)?;
                stashed
            } else {
                return Err("No files or stashed items available to send".to_string());
            }
        } else {
            check_for_existing_outgoing_stash_and_request_status()?;
            let req = make_new_outgoing_send_request(files)?;
            save_outgoing_request_to_stash(&req)?;
            req
        };

        let me = get_user_info().map_err(|e| e.to_user_message())?;
        Ok::<(OutgoingRequestState, crate::dusty::models::user::User), String>((outgoing_req, me))
    })
    .await
    .map_err(|e| e.to_string())??;

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
pub async fn add_file_to_stash(path: String) -> Result<OutgoingRequestState, String> {
    log::info!("[P2P API] add_file_to_stash called for path: {}", path);
    tokio::task::spawn_blocking(move || crate::dusty::p2p::stash::add_file_to_stash(path))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn add_show_to_stash(show: crate::dusty::models::shows::ShowResult) -> Result<OutgoingRequestState, String> {
    log::info!("[P2P API] add_show_to_stash called for show: {}", show.title);
    tokio::task::spawn_blocking(move || crate::dusty::p2p::stash::add_show_to_stash(show))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn select_send_files() -> Result<Vec<String>, String> {
    log::info!("[P2P API] select_send_files called");
    tokio::task::spawn_blocking(move || {
        let files = select_files_using_window();
        get_valid_files(files)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn get_p2p_history() -> Result<Vec<crate::dusty::p2p::P2PTransferHistoryRecord>, String> {
    log::info!("[P2P API] get_p2p_history called");
    tokio::task::spawn_blocking(move || Ok(crate::dusty::p2p::load_p2p_history()))
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn start_manual_receive() -> Result<crate::dusty::p2p::ManualReceiveStatus, String> {
    log::info!("[P2P API] start_manual_receive called");
    tokio::task::spawn_blocking(move || crate::dusty::p2p::manual::start_manual_receive())
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn stop_manual_receive() -> Result<(), String> {
    log::info!("[P2P API] stop_manual_receive called");
    tokio::task::spawn_blocking(move || crate::dusty::p2p::manual::stop_manual_receive())
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn get_manual_receive_status() -> Result<crate::dusty::p2p::ManualReceiveStatus, String> {
    tokio::task::spawn_blocking(move || crate::dusty::p2p::manual::get_manual_receive_status())
        .await
        .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn start_manual_send(
    app_handle: tauri::AppHandle,
    receiver_ip: String,
    files: Vec<String>,
) -> Result<(), String> {
    log::info!(
        "[P2P API] start_manual_send called for IP: {}, files count: {}",
        receiver_ip,
        files.len()
    );
    crate::dusty::p2p::set_transfer_cancelled(false);

    app_handle
        .state::<AppState>()
        .p2p_worker
        .dispatch(move || {
            if let Err(e) = crate::dusty::p2p::manual::start_manual_send(receiver_ip, files) {
                log::error!("[P2P API] start_manual_send failed: {}", e);
            }
        })
        .map_err(|_| "Failed to dispatch manual sender".to_string())
}