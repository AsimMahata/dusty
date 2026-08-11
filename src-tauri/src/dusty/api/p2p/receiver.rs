use chrono::DateTime;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::sync::mpsc;
use tokio::sync::oneshot;

use crate::dusty::api::p2p::p2p::{
    ActiveTransfer, PendingTransfer, TransferFileProgress, P2P_STATE,
};
use crate::dusty::api::{Discovery, Peer, ReceiverHandshake, SenderInfo};
use crate::dusty::models::user::User;

pub fn seach_for_available_senders(tx: oneshot::Sender<Vec<PendingTransfer>>) {
    log::info!("[P2P Receiver] Starting mDNS scan for available senders (30s)...");

    let service_type = "_dusty._tcp.local.".to_string();
    let duration = 3;
    let discovery = Discovery::new(
        service_type,
        duration,
        crate::dusty::api::p2p::RECEIVER_DISCOVERY_PORT,
    );

    let (mpsc_tx, mpsc_rx) = mpsc::channel::<SenderInfo>();

    let _ = discovery.discover(mpsc_tx);

    let mut pending_list = Vec::new();
    while let Ok(info) = mpsc_rx.try_recv() {
        if info.transfer_key().is_empty() {
            log::warn!(
                "[P2P Receiver] Discovered peer '{}' has empty transfer_key, skipping...",
                info.peer().name()
            );
            continue;
        }

        pending_list.push(PendingTransfer {
            id: info.transfer_key().to_string(),
            sender_name: info.peer().name().to_string(),
            sender_ips: info.peer().addresses().clone(),
            sender_port: info.peer().tcp_port(),
            files: info.files().clone(),
        });
    }

    if let Ok(mut state) = P2P_STATE.lock() {
        state.pending_transfers = pending_list.clone();
    }

    let _ = tx.send(pending_list);
}

pub fn connect_to_sender(sender_ip: &str, sender_port: u16) -> Result<TcpStream, String> {
    let addr_primary = format!("{}:{}", sender_ip, sender_port);
    log::info!(
        "[P2P Receiver] Connecting to sender TCP address: {}",
        addr_primary
    );

    match TcpStream::connect(&addr_primary) {
        Ok(stream) => {
            stream.set_nonblocking(false).ok();
            stream
                .set_read_timeout(Some(std::time::Duration::from_secs(30)))
                .ok();
            stream
                .set_write_timeout(Some(std::time::Duration::from_secs(30)))
                .ok();
            Ok(stream)
        }
        Err(e_primary) => {
            let next_port = sender_port.saturating_add(1);
            let addr_fallback = format!("{}:{}", sender_ip, next_port);
            log::warn!(
                "[P2P Receiver] Primary TCP port {} unavailable ({}); trying fallback port {}...",
                sender_port,
                e_primary,
                next_port
            );

            match TcpStream::connect(&addr_fallback) {
                Ok(stream) => {
                    stream.set_nonblocking(false).ok();
                    stream
                        .set_read_timeout(Some(std::time::Duration::from_secs(30)))
                        .ok();
                    stream
                        .set_write_timeout(Some(std::time::Duration::from_secs(30)))
                        .ok();
                    Ok(stream)
                }
                Err(e_fallback) => Err(format!(
                    "Failed to connect to sender at {}:{} and fallback {}:{}: {}, {}",
                    sender_ip, sender_port, sender_ip, next_port, e_primary, e_fallback
                )),
            }
        }
    }
}

pub fn send_receiver_handshake(
    stream: &mut TcpStream,
    transfer_key: &str,
    my_info: &Peer,
) -> Result<(), String> {
    let handshake = ReceiverHandshake {
        transfer_key: transfer_key.to_string(),
        id: Some(my_info.id().to_string()),
        name: Some(my_info.name().to_string()),
        hostname: Some(my_info.hostname().to_string()),
        ip_addresses: my_info.addresses().clone(),
    };

    let payload = serde_json::to_string(&handshake)
        .map_err(|e| format!("Failed to serialize ReceiverHandshake: {}", e))?;

    log::info!("[P2P Receiver] Transmitting ReceiverHandshake payload to sender...");

    stream
        .write_all(payload.as_bytes())
        .map_err(|e| format!("Failed to send handshake payload to sender: {}", e))?;
    stream.flush().ok();

    let mut buf = [0u8; 128];
    let n = stream
        .read(&mut buf)
        .map_err(|e| format!("Failed to read handshake ACK response from sender: {}", e))?;
    let response = String::from_utf8_lossy(&buf[..n]);

    if !response.trim().starts_with("OK") {
        return Err(format!(
            "Sender rejected transfer handshake: {}",
            response.trim()
        ));
    }

    log::info!("[P2P Receiver] Sender confirmed handshake ('OK'). Ready to receive files.");
    Ok(())
}

fn read_header_line(stream: &mut TcpStream) -> Result<String, String> {
    let mut header_buf = Vec::new();
    let mut byte = [0u8; 1];

    loop {
        match stream.read(&mut byte) {
            Ok(1) => {
                if byte[0] == b'\n' {
                    break;
                }
                header_buf.push(byte[0]);
            }
            _ => break,
        }
    }

    if header_buf.is_empty() {
        return Ok(String::new());
    }

    Ok(String::from_utf8_lossy(&header_buf).trim().to_string())
}

fn send_cancel_signal_and_wait_ack(stream: &mut TcpStream) {
    stream.write_all(b"CANCEL\n").ok();
    stream.flush().ok();
    let mut ack_buf = [0u8; 64];
    let _ = stream.read(&mut ack_buf);
}

fn receive_single_file(
    stream: &mut TcpStream,
    file_idx: usize,
    file_name: &str,
    file_size: u64,
    download_dir: &std::path::Path,
    buffer: &mut [u8],
) -> Result<(), String> {
    log::info!(
        "[P2P Receiver] Receiving file #{} '{}' ({} bytes)...",
        file_idx + 1,
        file_name,
        file_size
    );

    if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
        log::warn!("[P2P Receiver] Cancelled before sending READY. Sending CANCEL...");
        send_cancel_signal_and_wait_ack(stream);
        return Err("Transfer cancelled by receiver".to_string());
    }

    stream.write_all(b"READY\n").ok();
    stream.flush().ok();

    let target_file_path = download_dir.join(file_name);
    let mut file = std::fs::File::create(&target_file_path)
        .map_err(|e| format!("Failed to create file '{:?}': {}", target_file_path, e))?;

    let mut file_bytes_received: u64 = 0;
    let mut transfer_aborted = false;

    while file_bytes_received < file_size {
        if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
            log::warn!("[P2P Receiver] Cancellation detected mid-transfer!");
            transfer_aborted = true;
            break;
        }

        let to_read = std::cmp::min(buffer.len() as u64, file_size - file_bytes_received) as usize;

        let bytes_read = match stream.read(&mut buffer[..to_read]) {
            Ok(0) => break,
            Ok(n) => n,
            Err(ref e)
                if e.kind() == std::io::ErrorKind::WouldBlock
                    || e.kind() == std::io::ErrorKind::TimedOut =>
            {
                if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
                    transfer_aborted = true;
                    break;
                }
                continue;
            }
            Err(e) => return Err(format!("Error reading file chunk from stream: {}", e)),
        };

        file.write_all(&buffer[..bytes_read])
            .map_err(|e| format!("Error writing chunk to disk file: {}", e))?;

        file_bytes_received += bytes_read as u64;

        let progress = if file_size > 0 {
            ((file_bytes_received as f64) / (file_size as f64)) * 100.0
        } else {
            100.0
        };

        if let Ok(mut state) = P2P_STATE.lock() {
            if let Some(ref mut active) = state.active_transfer {
                if file_idx < active.files.len() {
                    active.files[file_idx].progress = progress;
                }
                let total_files = active.files.len();
                if total_files > 0 {
                    let sum_progress: f64 = active.files.iter().map(|f| f.progress).sum();
                    active.overall_progress = sum_progress / (total_files as f64);
                }
            }
        }
    }

    if transfer_aborted || (file_size > 0 && file_bytes_received < file_size) {
        drop(file);
        let _ = std::fs::remove_file(&target_file_path);
        log::warn!(
            "[P2P Receiver] Removed incomplete file: {:?}",
            target_file_path
        );
        if transfer_aborted {
            send_cancel_signal_and_wait_ack(stream);
            return Err("Transfer cancelled by receiver".to_string());
        } else {
            return Err(format!(
                "Transfer incomplete: received {} of {} bytes for file '{}'",
                file_bytes_received, file_size, file_name
            ));
        }
    } else {
        log::info!("[P2P Receiver] Saved file: {:?}", target_file_path);
    }

    Ok(())
}

pub fn receive_file_transfer(
    stream: &mut TcpStream,
    sender_name: &str,
    transfer_key: &str,
    _files_count: usize,
    start_time: std::time::Instant,
) -> Result<(), String> {
    log::info!(
        "[P2P Receiver] Starting file payload reception for session: {}",
        transfer_key
    );

    let user_download_dir_location = dirs::download_dir()
        .ok_or_else(|| "Failed to locate user download directory".to_string())?;
    let folder_name = format!(
        "{}-{}",
        sender_name,
        chrono::Local::now().format("%Y-%m-%d")
    );
    let download_dir = user_download_dir_location
        .join("dusty")
        .join("p2p")
        .join(folder_name);

    std::fs::create_dir_all(&download_dir).map_err(|e| {
        format!(
            "Failed to create download directory '{:?}': {}",
            download_dir, e
        )
    })?;

    const CHUNK_SIZE: usize = 64 * 1024;
    let mut buffer = vec![0u8; CHUNK_SIZE];

    loop {
        if crate::dusty::api::p2p::p2p::is_transfer_cancelled() {
            log::warn!(
                "[P2P Receiver] Transfer cancelled locally. Sending CANCEL signal to sender..."
            );
            send_cancel_signal_and_wait_ack(stream);
            return Err("Transfer cancelled by receiver".to_string());
        }

        let header_str = read_header_line(stream)?;
        if header_str.is_empty() || header_str.starts_with("EOF_TRANSFER") {
            if header_str.starts_with("EOF_TRANSFER") {
                log::info!("[P2P Receiver] Received EOF_TRANSFER signal from sender.");
            }
            break;
        }

        if header_str.starts_with("CANCEL") {
            log::warn!(
                "[P2P Receiver] Received CANCEL signal from sender. Acknowledging with OK..."
            );
            stream.write_all(b"OK\n").ok();
            stream.flush().ok();
            return Err("Transfer cancelled by sender".to_string());
        }

        if header_str.starts_with("MANIFEST:") {
            let json_payload = &header_str["MANIFEST:".len()..];
            #[derive(serde::Deserialize)]
            struct ManifestItem {
                idx: usize,
                name: String,
                size: u64,
            }
            #[derive(serde::Deserialize)]
            struct ManifestPayload {
                files: Vec<ManifestItem>,
                total_bytes: u64,
            }

            if let Ok(manifest) = serde_json::from_str::<ManifestPayload>(json_payload) {
                log::info!(
                    "[P2P Receiver] Received TCP MANIFEST header ({} files, {} total bytes)",
                    manifest.files.len(),
                    manifest.total_bytes
                );
                if let Ok(mut state) = P2P_STATE.lock() {
                    if let Some(ref mut active) = state.active_transfer {
                        active.files = manifest
                            .files
                            .iter()
                            .map(|f| TransferFileProgress {
                                name: f.name.clone(),
                                progress: 0.0,
                            })
                            .collect();
                        active.total_bytes = Some(manifest.total_bytes);
                    }
                }
            }

            stream.write_all(b"MANIFEST_ACK\n").ok();
            stream.flush().ok();
            continue;
        }

        if header_str.starts_with("FILE:") {
            let parts: Vec<&str> = header_str.split(':').collect();
            if parts.len() < 4 {
                continue;
            }

            let file_idx: usize = parts[1].parse().unwrap_or(0);
            let file_name = parts[2];
            let file_size: u64 = parts[3].parse().unwrap_or(0);

            receive_single_file(
                stream,
                file_idx,
                file_name,
                file_size,
                &download_dir,
                &mut buffer,
            )?;
        }
    }

    let elapsed = start_time.elapsed().as_secs_f64();
    let elapsed_rounded = (elapsed * 10.0).round() / 10.0;

    if let Ok(mut state) = P2P_STATE.lock() {
        if let Some(ref mut active) = state.active_transfer {
            active.overall_progress = 100.0;
            active.status = "completed".to_string();
            active.total_time_secs = Some(elapsed_rounded);
            active.destination_path = Some(download_dir.to_string_lossy().to_string());
        }
    }

    log::info!("[P2P Receiver] All files received and saved successfully.");
    Ok(())
}

pub fn start_p2p_receiver(pending: PendingTransfer, me: Peer) -> Result<(), String> {
    log::info!(
        "[P2P Receiver] start_p2p_receiver called for sender '{}' (id: {})",
        pending.sender_name,
        pending.id
    );

    let start_time = std::time::Instant::now();
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
    state.mode = "transfer".to_string();
    state.active_transfer = Some(ActiveTransfer {
        id: pending.id.clone(),
        sender_name: pending.sender_name.clone(),
        receiver_name: me.name().to_string(),
        files: pending
            .files
            .iter()
            .map(|f| TransferFileProgress {
                name: f.clone(),
                progress: 0.0,
            })
            .collect(),
        overall_progress: 0.0,
        status: "in_progress".to_string(),
        role: "receiver".to_string(),
        total_time_secs: None,
        destination_path: None,
        total_bytes: None,
    });
    drop(state);

    let sender_ip = pending
        .sender_ips
        .first()
        .map(|s| s.as_str())
        .unwrap_or("127.0.0.1");
    let sender_port: u16 = pending.sender_port;

    match connect_to_sender(sender_ip, sender_port) {
        Ok(mut stream) => {
            if let Err(e) = send_receiver_handshake(&mut stream, &pending.id, &me) {
                log::error!("[P2P Receiver] Handshake failed: {}", e);
                let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                state.mode = "receive".to_string();
                state.active_transfer = None;
                return Err(e);
            }

            if let Err(e) = receive_file_transfer(
                &mut stream,
                &pending.sender_name,
                &pending.id,
                pending.files.len(),
                start_time,
            ) {
                log::error!("[P2P Receiver] File receiving failed: {}", e);
                let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
                state.mode = "receive".to_string();
                state.active_transfer = None;
                return Err(e);
            }

            Ok(())
        }
        Err(e) => {
            log::error!("[P2P Receiver] Connection failed: {}", e);
            let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;
            state.mode = "receive".to_string();
            state.active_transfer = None;
            Err(e)
        }
    }
}
