use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::Arc;
use std::time::{Duration, Instant};

use uuid::Uuid;

use crate::dusty::api::p2p::p2p::{ActiveTransfer, TransferFileProgress, P2P_STATE};
use crate::dusty::api::{discovery, Discovery, Peer, ReceiverHandshake};
use crate::dusty::config::get_user_info;
use crate::dusty::models::state::AppState;
use crate::dusty::models::user::User;

pub fn open_tcp_listener(tcp_port: u16) -> Result<(TcpListener, u16), String> {
    log::info!(
        "[P2P Sender] Opening local TCP control listener on port {}",
        tcp_port
    );
    match TcpListener::bind(format!("0.0.0.0:{}", tcp_port)) {
        Ok(listener) => {
            listener
                .set_nonblocking(true)
                .map_err(|e| format!("Failed to set listener non-blocking: {}", e))?;
            Ok((listener, tcp_port))
        }
        Err(e_primary) => {
            let fallback_port = tcp_port.saturating_add(1);
            log::warn!(
                "[P2P Sender] Primary port {} unavailable ({}); trying fallback port {}...",
                tcp_port,
                e_primary,
                fallback_port
            );

            match TcpListener::bind(format!("0.0.0.0:{}", fallback_port)) {
                Ok(listener) => {
                    listener
                        .set_nonblocking(true)
                        .map_err(|e| format!("Failed to set listener non-blocking: {}", e))?;
                    Ok((listener, fallback_port))
                }
                Err(e_fallback) => Err(format!(
                    "Failed to bind TCP listener on port {} and fallback port {}: {}, {}",
                    tcp_port, fallback_port, e_primary, e_fallback
                )),
            }
        }
    }
}

pub fn broadcast_sender_presence(
    transfer_key: &str,
    files: &Vec<String>,
    me: Peer,
    discovery_port: u16,
) -> Result<(Discovery, String), String> {
    let service_type = "_dusty._tcp.local.".to_string();
    let duration = 300;
    let discovery_channel = Discovery::new(service_type, duration, discovery_port);

    log::info!(
        "[P2P Sender]: Broadcasting presence with transfer_key: {}, discovery_port: {}, files: {:?}, peer: {:?}",
        transfer_key,
        discovery_port,
        files,
        me
    );
    let sender_info =
        crate::dusty::api::SenderInfo::new(me, transfer_key.to_string(), files.clone());
    let service_name = discovery_channel.broadcast(sender_info)?;
    Ok((discovery_channel, service_name))
}

pub fn verify_handshake_key(received_key: &str, expected_key: &str) -> bool {
    let valid = received_key == expected_key;
    log::info!(
        "[P2P Engine] Step 3a: Handshake key verification: {} (received: {}, expected: {})",
        valid,
        received_key,
        expected_key
    );
    valid
}

fn send_cancel_signal_and_reset_state(stream: &mut TcpStream, msg: &str) -> String {
    stream.write_all(b"CANCEL\n").ok();
    stream.flush().ok();
    let mut ack_buf = [0u8; 64];
    let _ = stream.read(&mut ack_buf);
    if let Ok(mut state) = P2P_STATE.lock() {
        state.mode = "send".to_string();
        state.active_transfer = None;
    }
    msg.to_string()
}

fn send_single_file(
    stream: &mut TcpStream,
    file_idx: usize,
    files_count: usize,
    file_path: &str,
    file_size: u64,
    total_bytes_all_files: u64,
    total_bytes_sent_cumulative: &mut u64,
    buffer: &mut [u8],
) -> Result<(), String> {
    if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
        log::warn!("[P2P Engine] Cancellation requested by sender before sending file. Sending CANCEL signal...");
        return Err(send_cancel_signal_and_reset_state(
            stream,
            "Transfer cancelled by sender",
        ));
    }

    let path = std::path::Path::new(file_path);
    let file_name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(file_path)
        .to_string();

    log::info!(
        "[P2P Engine] Sending file {}/{}: '{}' (size: {} bytes)",
        file_idx + 1,
        files_count,
        file_name,
        file_size
    );

    let header = format!("FILE:{}:{}:{}\n", file_idx, file_name, file_size);
    stream
        .write_all(header.as_bytes())
        .map_err(|e| format!("Failed to write file header to stream: {}", e))?;
    stream.flush().ok();

    let mut ack_buf = [0u8; 128];
    let n = stream
        .read(&mut ack_buf)
        .map_err(|e| format!("Failed to read header ACK from receiver: {}", e))?;
    let ack_str = String::from_utf8_lossy(&ack_buf[..n]);

    if ack_str.trim().starts_with("CANCEL") {
        log::warn!("[P2P Engine] Receiver cancelled transfer. Sending OK confirmation...");
        stream.write_all(b"OK\n").ok();
        stream.flush().ok();
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "send".to_string();
            state.active_transfer = None;
        }
        return Err("Transfer cancelled by receiver".to_string());
    }

    let mut file = std::fs::File::open(file_path)
        .map_err(|e| format!("Failed to open file for transfer '{}': {}", file_path, e))?;

    let mut file_bytes_sent: u64 = 0;

    loop {
        if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
            log::warn!("[P2P Engine] Cancellation requested by sender during file streaming!");
            return Err(send_cancel_signal_and_reset_state(
                stream,
                "Transfer cancelled by sender",
            ));
        }

        let bytes_read = file
            .read(buffer)
            .map_err(|e| format!("Error reading from file '{}': {}", file_path, e))?;

        if bytes_read == 0 {
            break;
        }

        stream
            .write_all(&buffer[..bytes_read])
            .map_err(|e| format!("Error writing chunk to TCP stream: {}", e))?;

        file_bytes_sent += bytes_read as u64;
        *total_bytes_sent_cumulative += bytes_read as u64;

        let file_progress = if file_size > 0 {
            ((file_bytes_sent as f64) / (file_size as f64)) * 100.0
        } else {
            100.0
        };

        let overall_progress = if total_bytes_all_files > 0 {
            ((*total_bytes_sent_cumulative as f64) / (total_bytes_all_files as f64)) * 100.0
        } else {
            100.0
        };

        if let Ok(mut state) = P2P_STATE.lock() {
            if let Some(ref mut active) = state.active_transfer {
                if file_idx < active.files.len() {
                    active.files[file_idx].progress = file_progress;
                }
                active.overall_progress = overall_progress;
            }
        }
    }

    stream.flush().ok();

    if let Ok(mut state) = P2P_STATE.lock() {
        if let Some(ref mut active) = state.active_transfer {
            if file_idx < active.files.len() {
                active.files[file_idx].progress = 100.0;
            }
        }
    }

    log::info!("[P2P Engine] Finished sending file '{}'", file_name);
    Ok(())
}

pub fn execute_file_transfer(
    stream: &mut TcpStream,
    transfer_key: &str,
    files: &Vec<String>,
    start_time: Instant,
) -> Result<(), String> {
    log::info!(
        "[P2P Engine]: Starting chunked file transfer over TCP stream (peer: {:?}) for session key: {}, files count: {}",
        stream.peer_addr().ok(),
        transfer_key,
        files.len()
    );

    let mut total_bytes_all_files: u64 = 0;
    let mut file_sizes: Vec<u64> = Vec::new();

    for file_path in files {
        let meta = std::fs::metadata(file_path)
            .map_err(|e| format!("Failed to read metadata for file '{}': {}", file_path, e))?;
        file_sizes.push(meta.len());
        total_bytes_all_files += meta.len();
    }

    #[derive(serde::Serialize)]
    struct ManifestItem {
        idx: usize,
        name: String,
        size: u64,
    }
    #[derive(serde::Serialize)]
    struct ManifestPayload {
        files: Vec<ManifestItem>,
        total_bytes: u64,
    }

    let manifest_items: Vec<ManifestItem> = files
        .iter()
        .enumerate()
        .map(|(idx, file_path)| {
            let name = std::path::Path::new(file_path)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or(file_path)
                .to_string();
            ManifestItem {
                idx,
                name,
                size: file_sizes[idx],
            }
        })
        .collect();

    let manifest = ManifestPayload {
        files: manifest_items,
        total_bytes: total_bytes_all_files,
    };

    if let Ok(json_str) = serde_json::to_string(&manifest) {
        log::info!("[P2P Sender] Transmitting TCP MANIFEST header ({} files, {} total bytes)", manifest.files.len(), manifest.total_bytes);
        let manifest_header = format!("MANIFEST:{}\n", json_str);
        stream
            .write_all(manifest_header.as_bytes())
            .map_err(|e| format!("Failed to send MANIFEST header to receiver: {}", e))?;
        stream.flush().ok();

        let mut ack_buf = [0u8; 128];
        let n = stream
            .read(&mut ack_buf)
            .map_err(|e| format!("Failed to read MANIFEST_ACK from receiver: {}", e))?;
        let ack_str = String::from_utf8_lossy(&ack_buf[..n]);
        if ack_str.trim().starts_with("CANCEL") {
            return Err("Transfer cancelled by receiver".to_string());
        }
    }

    let mut total_bytes_sent_cumulative: u64 = 0;
    const CHUNK_SIZE: usize = 64 * 1024;
    let mut buffer = vec![0u8; CHUNK_SIZE];

    for (file_idx, file_path) in files.iter().enumerate() {
        send_single_file(
            stream,
            file_idx,
            files.len(),
            file_path,
            file_sizes[file_idx],
            total_bytes_all_files,
            &mut total_bytes_sent_cumulative,
            &mut buffer,
        )?;
    }

    let _ = stream.write_all(b"EOF_TRANSFER\n");
    stream.flush().ok();

    let elapsed = start_time.elapsed().as_secs_f64();
    let elapsed_rounded = (elapsed * 10.0).round() / 10.0;

    if let Ok(mut state) = P2P_STATE.lock() {
        if let Some(ref mut active) = state.active_transfer {
            active.overall_progress = 100.0;
            active.status = "completed".to_string();
            active.total_time_secs = Some(elapsed_rounded);
            active.total_bytes = Some(total_bytes_all_files);
        }
    }

    log::info!(
        "[P2P Engine] All files transferred successfully for session key {}",
        transfer_key
    );
    Ok(())
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
                if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
                    log::info!("[P2P Sender] Transfer cancellation requested by sender.");
                    crate::dusty::api::p2p::p2p::clear_outgoing_request_stash();
                    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                    state.mode = "send".to_string();
                    state.active_transfer = None;
                    return Err("Transfer cancelled by sender".to_string());
                }
                if start.elapsed() >= timeout {
                    log::info!("[P2P Sender] Request timed out after 60 seconds.");
                    if let Some(mut req) = crate::dusty::api::p2p::p2p::load_outgoing_request_from_stash() {
                        req.status = "TIMED_OUT".to_string();
                        let _ = crate::dusty::api::p2p::p2p::save_outgoing_request_to_stash(&req);
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
        .set_read_timeout(Some(Duration::from_secs(10)))
        .ok();
    control_stream
        .set_write_timeout(Some(Duration::from_secs(10)))
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

    if let Some(mut req) = crate::dusty::api::p2p::p2p::load_outgoing_request_from_stash() {
        req.status = "ACCEPTED".to_string();
        req.receiver_name = Some(receiver_name.clone());
        let _ = crate::dusty::api::p2p::p2p::save_outgoing_request_to_stash(&req);

        req.status = "INITIALIZING_TRANSFER".to_string();
        let _ = crate::dusty::api::p2p::p2p::save_outgoing_request_to_stash(&req);
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
    });
    drop(state);

    execute_file_transfer(&mut control_stream, transfer_key, files, start_time)?;
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

pub fn start_p2p_sender(
    req: crate::dusty::api::p2p::p2p::OutgoingRequestState,
    my_info: User,
) -> Result<(), String> {
    let transfer_key = req.id.clone();
    let files = req.files.clone();
    let (listener, bound_port) = open_tcp_listener(crate::dusty::api::p2p::SENDER_TRANSFER_PORT)?;

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
        crate::dusty::api::p2p::SENDER_DISCOVERY_PORT,
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
        crate::dusty::api::p2p::p2p::clear_outgoing_request_stash();
    }

    result
}
