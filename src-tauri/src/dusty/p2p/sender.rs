use std::io::Read;
use std::io::Write;
use std::net::TcpListener;
use std::time::Duration;
use std::time::Instant;
use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use uuid::Uuid;

use crate::dusty::models::user::User;
use crate::dusty::p2p::clear_outgoing_request_stash;
use crate::dusty::p2p::discovery::Discovery;
use crate::dusty::p2p::execute_file_transfer;
use crate::dusty::p2p::is_transfer_cancelled;
use crate::dusty::p2p::load_outgoing_request_from_stash;
use crate::dusty::p2p::open_tcp_listener;
use crate::dusty::p2p::save_outgoing_request_to_stash;
use crate::dusty::p2p::verify_handshake_key;
use crate::dusty::p2p::ActiveTransfer;
use crate::dusty::p2p::OutgoingRequestState;
use crate::dusty::p2p::Peer;
use crate::dusty::p2p::ReceiverHandshake;
use crate::dusty::p2p::SenderInfo;
use crate::dusty::p2p::TransferFileProgress;
use crate::dusty::p2p::P2P_STATE;
use crate::dusty::p2p::SENDER_DISCOVERY_PORT;
use crate::dusty::p2p::SENDER_TRANSFER_PORT;

pub fn check_for_existing_outgoing_stash_and_request_status() -> Result<(), String> {
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
            return Err(
                "An active outgoing request already exists. Please cancel or wait for timeout before creating a new request."
                    .to_string(),
            );
        }
    }

    Ok(())
}

pub fn make_new_outgoing_send_request(files: Vec<String>) -> Result<OutgoingRequestState, String> {
    log::info!("[P2P API] start_send called with files: {:#?}", files);

    let transfer_key = uuid::Uuid::new_v4().to_string();

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    Ok(OutgoingRequestState {
        id: transfer_key,
        files,
        status: "WAITING_FOR_ACCEPTANCE".to_string(),
        created_at: now,
        timeout_secs: 60,
        receiver_name: None,
    })
}

pub fn broadcast_sender_presence(
    transfer_key: &str,
    files: &Vec<String>,
    me: Peer,
    discovery_port: u16,
    created_at: u64,
    timeout_secs: u64,
) -> Result<(Discovery, String), String> {
    let service_type = "_dusty._tcp.local.".to_string();
    let duration = 60;
    let discovery_channel = Discovery::new(service_type, duration, discovery_port);

    log::info!(
        "[P2P Sender]: Broadcasting presence with transfer_key: {}, discovery_port: {}, files: {:?}, peer: {:?}, created_at: {}, timeout_secs: {}",
        transfer_key,
        discovery_port,
        files,
        me,
        created_at,
        timeout_secs
    );
    let sender_info = SenderInfo::new(
        me,
        transfer_key.to_string(),
        files.clone(),
        created_at,
        timeout_secs,
    );
    let service_name = discovery_channel.broadcast(sender_info)?;
    Ok((discovery_channel, service_name))
}

pub fn listen_for_confirmation_with_listener(
    listener: TcpListener,
    tcp_port: u16,
    transfer_key: &str,
    files: &Vec<String>,
    sender_name: &str,
) -> Result<(), String> {
    log::info!(
        "[P2P Sender] Waiting on TCP listener on port {} for receiver confirmation (timeout: 60s, expected key: {})",
        tcp_port,
        transfer_key
    );

    let start = Instant::now();
    let timeout = Duration::from_secs(60);

    let (mut control_stream, addr) = loop {
        match listener.accept() {
            Ok((stream, addr)) => {
                if let Err(e) = stream.set_nonblocking(false) {
                    log::warn!(
                        "[P2P Sender] Failed to set accepted stream to blocking mode: {}",
                        e
                    );
                }
                break (stream, addr);
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
                if is_transfer_cancelled() {
                    log::info!("[P2P Sender] Transfer cancellation requested by sender.");
                    clear_outgoing_request_stash();
                    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                    state.mode = "send".to_string();
                    state.active_transfer = None;
                    return Err("Transfer cancelled by sender".to_string());
                }
                if start.elapsed() >= timeout {
                    log::info!("[P2P Sender] Request timed out after 60 seconds.");
                    if let Some(mut req) = load_outgoing_request_from_stash() {
                        req.status = "TIMED_OUT".to_string();
                        let _ = save_outgoing_request_to_stash(&req);
                    }
                    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                    state.mode = "send".to_string();
                    state.active_transfer = None;
                    return Err(
                        "P2P Sender timeout: No receiver connected within 60 seconds".to_string(),
                    );
                }
                std::thread::sleep(Duration::from_millis(200));
            }
            Err(e) => {
                let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                state.mode = "send".to_string();
                state.active_transfer = None;
                return Err(format!("TCP accept error on listener: {}", e));
            }
        }
    };

    let receiver_ip = addr.ip().to_string();
    log::info!("[P2P Sender] Control connection received from {} (IP: {}). Reading full peer handshake payload...", addr, receiver_ip);

    control_stream
        .set_read_timeout(Some(Duration::from_secs(5)))
        .ok();
    control_stream
        .set_write_timeout(Some(Duration::from_secs(5)))
        .ok();

    let mut buf = [0u8; 1024];
    let bytes_read = control_stream.read(&mut buf).map_err(|e| {
        format!(
            "Failed to read handshake payload from control stream: {}",
            e
        )
    })?;
    let payload = String::from_utf8_lossy(&buf[..bytes_read])
        .trim()
        .to_string();

    let handshake_info: ReceiverHandshake = match serde_json::from_str(&payload) {
        Ok(parsed) => parsed,
        Err(_) => {
            let parts: Vec<&str> = payload.split('|').collect();
            ReceiverHandshake {
                transfer_key: parts.get(0).unwrap_or(&payload.as_str()).trim().to_string(),
                name: parts.get(1).map(|s| s.to_string()),
                id: parts.get(2).map(|s| s.to_string()),
                hostname: parts.get(3).map(|s| s.to_string()),
                ip_addresses: vec![receiver_ip.clone()],
            }
        }
    };

    if !verify_handshake_key(&handshake_info.transfer_key, transfer_key) {
        let err_msg = format!(
            "Handshake verification failed: received key '{}', expected '{}'",
            handshake_info.transfer_key, transfer_key
        );
        log::error!("[P2P Sender] {}", err_msg);
        let _ = control_stream.write_all(b"REJECTED\n");
        let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
        state.mode = "send".to_string();
        state.active_transfer = None;
        return Err(err_msg);
    }

    let receiver_name = handshake_info
        .name
        .filter(|n| !n.is_empty())
        .unwrap_or_else(|| format!("Receiver ({})", receiver_ip));

    if let Some(mut req) = load_outgoing_request_from_stash() {
        req.status = "ACCEPTED".to_string();
        req.receiver_name = Some(receiver_name.clone());
        let _ = save_outgoing_request_to_stash(&req);

        req.status = "INITIALIZING_TRANSFER".to_string();
        let _ = save_outgoing_request_to_stash(&req);
    }

    log::info!(
        "[P2P Sender] Handshake verified for receiver peer: name='{}', id='{:?}', hostname='{:?}', ip='{}'. Sending OK...",
        receiver_name,
        handshake_info.id,
        handshake_info.hostname,
        receiver_ip
    );
    let _ = control_stream.write_all(b"OK\n");

    let start_time = Instant::now();
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.mode = "transfer".to_string();
    state.active_transfer = Some(ActiveTransfer {
        id: transfer_key.to_string(),
        sender_name: sender_name.to_string(),
        receiver_name,
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
    drop(state);

    if let Err(e) = execute_file_transfer(&mut control_stream, transfer_key, files, start_time) {
        log::error!("[P2P Sender] Transfer failed or timed out: {}", e);
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }
        return Err(e);
    }

    Ok(())
}

pub fn listen_for_confirmation(
    tcp_port: u16,
    transfer_key: &str,
    files: &Vec<String>,
    sender_name: &str,
) -> Result<(), String> {
    let (listener, bound_port) = open_tcp_listener(tcp_port)?;
    listen_for_confirmation_with_listener(listener, bound_port, transfer_key, files, sender_name)
}

pub fn start_p2p_sender(req: OutgoingRequestState, my_info: User) -> Result<(), String> {
    let transfer_key = req.id.clone();
    let files = req.files.clone();
    let (listener, bound_port) = open_tcp_listener(SENDER_TRANSFER_PORT)?;

    let my_uuid = Uuid::parse_str(&my_info.id).unwrap_or_else(|_| Uuid::new_v4());
    let my_peer = Peer::peer_automatic_ip_address(
        my_uuid,
        my_info.display_name.clone(),
        my_info.hostname.clone(),
        bound_port,
    );
    let (discovery, service_name) = broadcast_sender_presence(
        &transfer_key,
        &files,
        my_peer,
        SENDER_DISCOVERY_PORT,
        req.created_at,
        req.timeout_secs,
    )?;

    let result = listen_for_confirmation_with_listener(
        listener,
        bound_port,
        &transfer_key,
        &files,
        &my_info.display_name,
    );

    log::info!("[P2P Sender] Transfer completed or timed out. Unregistering mDNS broadcast...");
    discovery.unregister(&service_name);
    discovery.shutdown();

    if result.is_ok() {
        clear_outgoing_request_stash();
    }

    result
}
