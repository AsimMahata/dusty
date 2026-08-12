use std::io::Read;
use std::io::Write;
use std::net::TcpStream;
use std::sync::atomic::AtomicBool;
use std::sync::atomic::Ordering;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;
use std::time::Instant;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use local_ip_address::local_ip;
use serde::Deserialize;
use serde::Serialize;

use crate::dusty::config::get_user_info;
use crate::dusty::p2p::history::create_and_record_history;
use crate::dusty::p2p::models::ActiveTransfer;
use crate::dusty::p2p::models::ManualReceiveStatus;
use crate::dusty::p2p::models::OutgoingRequestState;
use crate::dusty::p2p::models::PendingTransfer;
use crate::dusty::p2p::models::TransferFileProgress;
use crate::dusty::p2p::models::TransferItem;
use crate::dusty::p2p::receiver::receive_file_transfer;
use crate::dusty::p2p::stash::clear_outgoing_request_stash;
use crate::dusty::p2p::stash::load_outgoing_request_from_stash;
use crate::dusty::p2p::stash::save_outgoing_request_to_stash;
use crate::dusty::p2p::tcp::open_tcp_listener;
use crate::dusty::p2p::tcp::read_header_line;
use crate::dusty::p2p::transfer::execute_file_transfer;
use crate::dusty::p2p::P2P_STATE;
use crate::dusty::p2p::RECEIVER_TRANSFER_PORT;

pub static MANUAL_LISTENER_ACTIVE: AtomicBool = AtomicBool::new(false);

pub static MANUAL_RECEIVE_INFO: Mutex<ManualReceiveStatus> = Mutex::new(ManualReceiveStatus {
    is_listening: false,
    ip_address: None,
    port: None,
});

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManualRequestPayload {
    pub transfer_key: String,
    pub sender_name: String,
    pub files: Vec<String>,
    pub items: Vec<TransferItem>,
    pub created_at: u64,
    pub timeout_secs: u64,
}

pub fn get_usable_local_ip() -> Result<String, String> {
    if let Ok(ip) = local_ip() {
        let ip_str = ip.to_string();
        if !ip_str.starts_with("127.") {
            return Ok(ip_str);
        }
    }

    if let Ok(netifas) = local_ip_address::list_afinet_netifas() {
        for (_name, ip) in netifas {
            if ip.is_ipv4() && !ip.is_loopback() {
                let s = ip.to_string();
                if !s.starts_with("169.254.") {
                    return Ok(s);
                }
            }
        }
    }

    Err("Could not find a valid local IPv4 address".to_string())
}

pub fn get_manual_receive_status() -> Result<ManualReceiveStatus, String> {
    let info = MANUAL_RECEIVE_INFO.lock().map_err(|e| e.to_string())?;
    Ok(info.clone())
}

pub fn stop_manual_receive() -> Result<(), String> {
    log::info!("[P2P Manual] Stopping manual receive TCP listener...");
    MANUAL_LISTENER_ACTIVE.store(false, Ordering::SeqCst);

    let mut info = MANUAL_RECEIVE_INFO.lock().map_err(|e| e.to_string())?;
    info.is_listening = false;
    info.ip_address = None;
    info.port = None;

    if let Ok(mut state) = P2P_STATE.lock() {
        if state.mode == "receive" {
            state.mode = "send".to_string();
        }
    }

    Ok(())
}

pub fn start_manual_receive() -> Result<ManualReceiveStatus, String> {
    if MANUAL_LISTENER_ACTIVE.load(Ordering::SeqCst) {
        return get_manual_receive_status();
    }

    let ip_address = get_usable_local_ip()?;
    let (listener, bound_port) = open_tcp_listener(RECEIVER_TRANSFER_PORT)?;

    MANUAL_LISTENER_ACTIVE.store(true, Ordering::SeqCst);

    let status = ManualReceiveStatus {
        is_listening: true,
        ip_address: Some(ip_address.clone()),
        port: Some(bound_port),
    };

    if let Ok(mut info) = MANUAL_RECEIVE_INFO.lock() {
        *info = status.clone();
    }

    if let Ok(mut state) = P2P_STATE.lock() {
        state.mode = "receive".to_string();
    }

    log::info!(
        "[P2P Manual] Manual receive listener active on {}:{}",
        ip_address,
        bound_port
    );

    thread::spawn(move || {
        listener.set_nonblocking(true).ok();

        while MANUAL_LISTENER_ACTIVE.load(Ordering::SeqCst) {
            match listener.accept() {
                Ok((stream, addr)) => {
                    log::info!(
                        "[P2P Manual] Accepted incoming direct-IP TCP connection from {}",
                        addr
                    );
                    stream.set_nonblocking(false).ok();

                    let _ = handle_incoming_manual_connection(stream, addr.ip().to_string());
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                    thread::sleep(Duration::from_millis(200));
                }
                Err(e) => {
                    log::error!("[P2P Manual] TCP accept error on manual listener: {}", e);
                    thread::sleep(Duration::from_millis(500));
                }
            }
        }

        log::info!("[P2P Manual] Manual listener loop exited.");
    });

    Ok(status)
}

fn handle_incoming_manual_connection(
    mut stream: TcpStream,
    sender_ip: String,
) -> Result<(), String> {
    stream.set_read_timeout(Some(Duration::from_secs(10))).ok();
    stream.set_write_timeout(Some(Duration::from_secs(10))).ok();

    let mut buf = [0u8; 4096];
    let n = match stream.read(&mut buf) {
        Ok(0) => return Err("Connection closed before sending request payload".to_string()),
        Ok(n) => n,
        Err(e) => return Err(format!("Failed to read request payload: {}", e)),
    };

    let payload_str = String::from_utf8_lossy(&buf[..n]).trim().to_string();
    let req: ManualRequestPayload = match serde_json::from_str(&payload_str) {
        Ok(p) => p,
        Err(e) => {
            log::error!(
                "[P2P Manual] Invalid request payload from sender {}: {}",
                sender_ip,
                e
            );
            let _ = stream.write_all(b"REJECTED:Invalid request payload\n");
            return Err("Invalid request payload".to_string());
        }
    };

    log::info!(
        "[P2P Manual] Received valid transfer request '{}' from sender '{}' ({})",
        req.transfer_key,
        req.sender_name,
        sender_ip
    );

    let pending = PendingTransfer {
        id: req.transfer_key.clone(),
        sender_name: req.sender_name.clone(),
        sender_ips: vec![sender_ip.clone()],
        sender_port: 0,
        files: req.files.clone(),
        items: req.items.clone(),
        created_at: req.created_at,
        timeout_secs: req.timeout_secs,
    };

    if let Ok(mut state) = P2P_STATE.lock() {
        state.pending_transfers.retain(|t| t.id != req.transfer_key);
        state.pending_transfers.push(pending.clone());
    }

    let start_wait = Instant::now();
    let wait_timeout = Duration::from_secs(60);

    let mut decision: Option<bool> = None;

    while start_wait.elapsed() < wait_timeout {
        let is_accepted = if let Ok(state) = P2P_STATE.lock() {
            if state.active_transfer.as_ref().map(|a| a.id.clone())
                == Some(req.transfer_key.clone())
            {
                Some(true)
            } else if !state
                .pending_transfers
                .iter()
                .any(|t| t.id == req.transfer_key)
            {
                Some(false)
            } else {
                None
            }
        } else {
            None
        };

        if let Some(accepted) = is_accepted {
            decision = Some(accepted);
            break;
        }

        thread::sleep(Duration::from_millis(250));
    }

    match decision {
        Some(true) => {
            log::info!(
                "[P2P Manual] Receiver ACCEPTED transfer request '{}'",
                req.transfer_key
            );
            let _ = stream.write_all(b"ACCEPT\n");
            stream.flush().ok();

            let start_time = Instant::now();

            let res = receive_file_transfer(
                &mut stream,
                &req.sender_name,
                &req.transfer_key,
                req.files.len(),
                start_time,
            );

            let (total_bytes, duration_secs) = if let Ok(state) = P2P_STATE.lock() {
                if let Some(ref active) = state.active_transfer {
                    (active.total_bytes, active.total_time_secs)
                } else {
                    (None, None)
                }
            } else {
                (None, None)
            };

            let status_str = match &res {
                Ok(_) => "COMPLETED".to_string(),
                Err(e) if e.contains("cancelled") => "CANCELLED".to_string(),
                Err(_) => "FAILED".to_string(),
            };

            create_and_record_history(
                req.transfer_key,
                "incoming".to_string(),
                "receiver".to_string(),
                req.items,
                req.files,
                req.sender_name,
                Some(sender_ip),
                req.created_at,
                status_str,
                res.as_ref().err().cloned(),
                total_bytes,
                duration_secs,
            );

            if let Ok(mut state) = P2P_STATE.lock() {
                if MANUAL_LISTENER_ACTIVE.load(Ordering::SeqCst) {
                    state.mode = "receive".to_string();
                } else {
                    state.mode = "send".to_string();
                }
                state.active_transfer = None;
            }

            res
        }
        Some(false) => {
            log::info!(
                "[P2P Manual] Receiver REJECTED transfer request '{}'",
                req.transfer_key
            );
            let _ = stream.write_all(b"REJECTED\n");
            stream.flush().ok();
            Err("Transfer rejected by receiver".to_string())
        }
        None => {
            log::warn!(
                "[P2P Manual] Request '{}' timed out after 60s waiting for acceptance",
                req.transfer_key
            );
            let _ = stream.write_all(b"TIMED_OUT\n");
            stream.flush().ok();

            if let Ok(mut state) = P2P_STATE.lock() {
                state.pending_transfers.retain(|t| t.id != req.transfer_key);
            }
            Err("Request timed out".to_string())
        }
    }
}

pub fn start_manual_send(receiver_ip: String, files: Vec<String>) -> Result<(), String> {
    log::info!(
        "[P2P Manual] Initiating manual send to receiver IP: {}",
        receiver_ip
    );

    let trimmed_ip = receiver_ip.trim().to_string();
    if trimmed_ip.parse::<std::net::IpAddr>().is_err() {
        return Err("Invalid receiver IP address format".to_string());
    }

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
        let transfer_key = uuid::Uuid::new_v4().to_string();
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0);
        let items = files
            .iter()
            .map(|p| TransferItem::File { path: p.clone() })
            .collect();
        let req = OutgoingRequestState {
            id: transfer_key,
            files: files.clone(),
            items,
            status: "WAITING_FOR_ACCEPTANCE".to_string(),
            created_at: now,
            timeout_secs: 60,
            receiver_name: None,
        };
        save_outgoing_request_to_stash(&req)?;
        req
    };

    let me = get_user_info().map_err(|e| e.to_user_message())?;

    let addr_primary = format!("{}:{}", trimmed_ip, RECEIVER_TRANSFER_PORT);
    let fallback_port = RECEIVER_TRANSFER_PORT.saturating_add(5);
    let addr_fallback = format!("{}:{}", trimmed_ip, fallback_port);

    log::info!("[P2P Manual] Connecting to receiver at {}", addr_primary);

    let mut stream = match TcpStream::connect(&addr_primary) {
        Ok(s) => s,
        Err(e_primary) => match TcpStream::connect(&addr_fallback) {
            Ok(s) => s,
            Err(e_fallback) => {
                return Err(format!(
                    "Failed to connect to receiver at {} (primary: {}, fallback: {})",
                    trimmed_ip, e_primary, e_fallback
                ));
            }
        },
    };

    stream.set_nonblocking(false).ok();
    stream.set_read_timeout(Some(Duration::from_secs(65))).ok();
    stream.set_write_timeout(Some(Duration::from_secs(10))).ok();

    let payload = ManualRequestPayload {
        transfer_key: outgoing_req.id.clone(),
        sender_name: me.display_name.clone(),
        files: outgoing_req.files.clone(),
        items: outgoing_req.get_items(),
        created_at: outgoing_req.created_at,
        timeout_secs: outgoing_req.timeout_secs,
    };

    let payload_bytes = serde_json::to_vec(&payload)
        .map_err(|e| format!("Failed to serialize manual request payload: {}", e))?;

    log::info!("[P2P Manual] Transmitting manual request payload to receiver...");
    stream
        .write_all(&payload_bytes)
        .map_err(|e| format!("Failed to send request payload: {}", e))?;
    stream.flush().ok();

    let response_str = read_header_line(&mut stream)?;
    log::info!("[P2P Manual] Receiver response: '{}'", response_str);

    if response_str.starts_with("ACCEPT") {
        if let Some(mut req) = load_outgoing_request_from_stash() {
            req.status = "ACCEPTED".to_string();
            let _ = save_outgoing_request_to_stash(&req);
        }

        let start_time = Instant::now();
        let files = outgoing_req.files.clone();
        let items = outgoing_req.get_items();

        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "transfer".to_string();
            state.active_transfer = Some(ActiveTransfer {
                id: outgoing_req.id.clone(),
                sender_name: me.display_name.clone(),
                receiver_name: format!("Receiver ({})", trimmed_ip),
                files: files
                    .iter()
                    .map(|f| TransferFileProgress {
                        name: f.clone(),
                        progress: 0.0,
                    })
                    .collect(),
                overall_progress: 0.0,
                status: "in_progress".to_string(),
                role: "sender".to_string(),
                total_time_secs: None,
                destination_path: None,
                total_bytes: None,
                speed_bytes_per_sec: 0.0,
            });
        }

        let result =
            execute_file_transfer(&mut stream, &outgoing_req.id, &files, &items, start_time);

        let (total_bytes, duration_secs) = if let Ok(state) = P2P_STATE.lock() {
            if let Some(ref active) = state.active_transfer {
                (active.total_bytes, active.total_time_secs)
            } else {
                (None, None)
            }
        } else {
            (None, None)
        };

        let status_str = match &result {
            Ok(_) => "COMPLETED".to_string(),
            Err(e) if e.contains("cancelled") => "CANCELLED".to_string(),
            Err(_) => "FAILED".to_string(),
        };

        create_and_record_history(
            outgoing_req.id.clone(),
            "outgoing".to_string(),
            "sender".to_string(),
            items,
            files,
            format!("Receiver ({})", trimmed_ip),
            Some(trimmed_ip),
            outgoing_req.created_at,
            status_str,
            result.as_ref().err().cloned(),
            total_bytes,
            duration_secs,
        );

        if result.is_ok() {
            clear_outgoing_request_stash();
        } else if let Err(ref e) = result {
            if let Some(mut req) = load_outgoing_request_from_stash() {
                if e.to_lowercase().contains("cancel") || e.contains("Receiver") {
                    req.status = "CANCELLED_BY_RECEIVER".to_string();
                } else {
                    req.status = "FAILED".to_string();
                }
                let _ = save_outgoing_request_to_stash(&req);
            }
        }

        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }

        result
    } else if response_str.starts_with("REJECTED") {
        if let Some(mut req) = load_outgoing_request_from_stash() {
            req.status = "REJECTED".to_string();
            let _ = save_outgoing_request_to_stash(&req);
        }
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }
        Err("Request was rejected by the receiver".to_string())
    } else if response_str.starts_with("TIMED_OUT") {
        if let Some(mut req) = load_outgoing_request_from_stash() {
            req.status = "TIMED_OUT".to_string();
            let _ = save_outgoing_request_to_stash(&req);
        }
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }
        Err("Request timed out waiting for receiver acceptance".to_string())
    } else {
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }
        Err(format!(
            "Unexpected response from receiver: {}",
            response_str
        ))
    }
}
