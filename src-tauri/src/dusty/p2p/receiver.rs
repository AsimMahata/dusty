use std::io::Read;
use std::io::Write;
use std::net::TcpStream;
use std::sync::mpsc;
use tokio::sync::oneshot;

use crate::dusty::db::show::add_shows_in_db;
use crate::dusty::p2p::is_transfer_cancelled;
use crate::dusty::p2p::read_header_line;
use crate::dusty::p2p::send_cancel_signal_and_wait_ack;
use crate::dusty::p2p::ActiveTransfer;
use crate::dusty::p2p::Discovery;
use crate::dusty::p2p::ManifestPayload;
use crate::dusty::p2p::Peer;
use crate::dusty::p2p::PendingTransfer;
use crate::dusty::p2p::ReceiverHandshake;
use crate::dusty::p2p::SenderInfo;
use crate::dusty::p2p::TransferFileProgress;
use crate::dusty::p2p::TransferItem;
use crate::dusty::p2p::P2P_STATE;
use crate::dusty::p2p::RECEIVER_DISCOVERY_PORT;

fn get_db_connection() -> Result<rusqlite::Connection, String> {
    let local_data = dirs::data_local_dir()
        .or_else(dirs::home_dir)
        .ok_or_else(|| "Failed to get local data dir".to_string())?;

    let possible_paths = [
        local_data.join("com.dusty.dev").join("database").join("dusty.db"),
        local_data.join("dusty").join("database").join("dusty.db"),
        dirs::home_dir()
            .map(|h| h.join(".dusty").join("database").join("dusty.db"))
            .unwrap_or_default(),
    ];

    for path in &possible_paths {
        if path.exists() {
            return rusqlite::Connection::open(path).map_err(|e| e.to_string());
        }
    }

    if let Some(parent) = possible_paths[0].parent() {
        let _ = std::fs::create_dir_all(parent);
    }
    rusqlite::Connection::open(&possible_paths[0]).map_err(|e| e.to_string())
}

pub fn seach_for_available_senders(tx: oneshot::Sender<Vec<PendingTransfer>>) {
    log::info!("[P2P Receiver] Starting mDNS scan for available senders (30s)...");

    let service_type = "_dusty._tcp.local.".to_string();
    let duration = 3;
    let discovery = Discovery::new(service_type, duration, RECEIVER_DISCOVERY_PORT);

    let (mpsc_tx, mpsc_rx) = mpsc::channel::<SenderInfo>();

    let _ = discovery.discover(mpsc_tx);

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);

    let mut pending_list = Vec::new();
    while let Ok(info) = mpsc_rx.try_recv() {
        if info.transfer_key().is_empty() {
            log::warn!(
                "[P2P Receiver] Discovered peer '{}' has empty transfer_key, skipping...",
                info.peer().name()
            );
            continue;
        }

        let created_at = info.created_at();
        let timeout_secs = info.timeout_secs();

        if created_at > 0 && timeout_secs > 0 && now >= created_at + timeout_secs {
            log::info!(
                "[P2P Receiver] Discovered request '{}' from '{}' is expired (created_at: {}, timeout: {}s), ignoring...",
                info.transfer_key(),
                info.peer().name(),
                created_at,
                timeout_secs
            );
            continue;
        }

        pending_list.push(PendingTransfer {
            id: info.transfer_key().to_string(),
            sender_name: info.peer().name().to_string(),
            sender_ips: info.peer().addresses().clone(),
            sender_port: info.peer().tcp_port(),
            files: info.files().clone(),
            items: info.items().clone(),
            created_at,
            timeout_secs,
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
                .set_read_timeout(Some(std::time::Duration::from_secs(10)))
                .ok();
            stream
                .set_write_timeout(Some(std::time::Duration::from_secs(10)))
                .ok();
            Ok(stream)
        }
        Err(e_primary) => {
            let next_port = sender_port.saturating_add(5);
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
                        .set_read_timeout(Some(std::time::Duration::from_secs(10)))
                        .ok();
                    stream
                        .set_write_timeout(Some(std::time::Duration::from_secs(10)))
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

fn receive_single_file(
    stream: &mut TcpStream,
    file_idx: usize,
    file_name: &str,
    file_size: u64,
    download_dir: &std::path::Path,
    buffer: &mut [u8],
    total_bytes_received_cumulative: &mut u64,
    last_speed_check: &mut std::time::Instant,
    bytes_at_last_check: &mut u64,
) -> Result<(), String> {
    log::info!(
        "[P2P Receiver] Receiving file #{} '{}' ({} bytes)...",
        file_idx + 1,
        file_name,
        file_size
    );

    if is_transfer_cancelled() {
        log::warn!("[P2P Receiver] Cancelled before sending READY. Sending CANCEL...");
        send_cancel_signal_and_wait_ack(stream);
        return Err("Transfer cancelled by receiver".to_string());
    }

    stream.write_all(b"READY\n").ok();
    stream.flush().ok();

    let target_file_path = download_dir.join(file_name);
    let mut file = match std::fs::File::create(&target_file_path) {
        Ok(f) => f,
        Err(e) => {
            let err_msg = format!("Failed to create file '{:?}': {}", target_file_path, e);
            log::error!("[P2P Receiver] {}", err_msg);
            crate::dusty::p2p::send_cancel_signal_with_reason(stream, &err_msg);
            return Err(err_msg);
        }
    };

    let mut file_bytes_received: u64 = 0;
    let mut transfer_aborted = false;

    while file_bytes_received < file_size {
        if is_transfer_cancelled() {
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
                if is_transfer_cancelled() {
                    transfer_aborted = true;
                    break;
                }
                continue;
            }
            Err(e) => {
                let err_msg = format!("Error reading file chunk from stream: {}", e);
                crate::dusty::p2p::send_cancel_signal_with_reason(stream, &err_msg);
                return Err(err_msg);
            }
        };

        if let Err(e) = file.write_all(&buffer[..bytes_read]) {
            let err_msg = format!("Error writing chunk to disk file: {}", e);
            log::error!("[P2P Receiver] {}", err_msg);
            crate::dusty::p2p::send_cancel_signal_with_reason(stream, &err_msg);
            drop(file);
            let _ = std::fs::remove_file(&target_file_path);
            return Err(err_msg);
        }

        file_bytes_received += bytes_read as u64;
        *total_bytes_received_cumulative += bytes_read as u64;

        let elapsed = last_speed_check.elapsed();
        let mut speed_to_update: Option<f64> = None;
        if elapsed >= std::time::Duration::from_millis(500) {
            let bytes_in_interval =
                total_bytes_received_cumulative.saturating_sub(*bytes_at_last_check);
            let elapsed_secs = elapsed.as_secs_f64();
            let current_speed = if elapsed_secs > 0.0 {
                (bytes_in_interval as f64) / elapsed_secs
            } else {
                0.0
            };
            speed_to_update = Some(current_speed);
            *last_speed_check = std::time::Instant::now();
            *bytes_at_last_check = *total_bytes_received_cumulative;
        }

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
                if let Some(spd) = speed_to_update {
                    active.speed_bytes_per_sec = spd;
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
            let err_msg = format!(
                "Transfer incomplete: received {} of {} bytes for file '{}'",
                file_bytes_received, file_size, file_name
            );
            crate::dusty::p2p::send_cancel_signal_with_reason(stream, &err_msg);
            return Err(err_msg);
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
        "[P2P Receiver] Starting payload reception for session: {}",
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
    let mut total_bytes_received_cumulative: u64 = 0;
    let mut last_speed_check = std::time::Instant::now();
    let mut bytes_at_last_check: u64 = 0;
    let mut current_manifest: Option<ManifestPayload> = None;

    loop {
        if is_transfer_cancelled() {
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
            let reason = if header_str.starts_with("CANCEL:") {
                header_str["CANCEL:".len()..].to_string()
            } else {
                "Transfer cancelled by sender".to_string()
            };
            log::warn!(
                "[P2P Receiver] Received CANCEL signal from sender ({}). Acknowledging with OK...",
                reason
            );
            stream.write_all(b"OK\n").ok();
            stream.flush().ok();
            return Err(format!("Sender error: {}", reason));
        }

        if header_str.starts_with("MANIFEST:") {
            let json_payload = &header_str["MANIFEST:".len()..];
            if let Ok(manifest) = serde_json::from_str::<ManifestPayload>(json_payload) {
                log::info!(
                    "[P2P Receiver] Received TCP MANIFEST header ({} files, {} total bytes)",
                    manifest.files.len(),
                    manifest.total_bytes
                );
                current_manifest = Some(manifest.clone());
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

            let file_download_dir = if let Some(ref manifest) = current_manifest {
                if let Some(manifest_item) = manifest.files.get(file_idx) {
                    if let Some(ref rel_path) = manifest_item.relative_path {
                        let path_obj = std::path::Path::new(rel_path);
                        if let Some(parent) = path_obj.parent() {
                            download_dir.join(parent)
                        } else {
                            download_dir.clone()
                        }
                    } else {
                        download_dir.clone()
                    }
                } else {
                    download_dir.clone()
                }
            } else {
                download_dir.clone()
            };

            std::fs::create_dir_all(&file_download_dir).ok();

            receive_single_file(
                stream,
                file_idx,
                file_name,
                file_size,
                &file_download_dir,
                &mut buffer,
                &mut total_bytes_received_cumulative,
                &mut last_speed_check,
                &mut bytes_at_last_check,
            )?;
        }
    }

    if let Some(manifest) = current_manifest {
        for item in manifest.items {
            match item {
                TransferItem::File { path } => {
                    log::info!("[P2P Receiver] Successfully received file item: {}", path);
                }
                TransferItem::Show { mut show } => {
                    let show_dir = download_dir.join(&show.title);
                    let show_dir_str = show_dir.to_string_lossy().to_string();
                    show.dir = Some(show_dir_str);

                    for ep in &mut show.episodes {
                        let new_ep_path = show_dir.join(ep.get_name());
                        ep.path = new_ep_path;
                    }

                    if let Ok(conn) = get_db_connection() {
                        if let Err(e) = add_shows_in_db(&conn, &vec![show.clone()]) {
                            log::error!(
                                "[P2P Receiver] Failed to register incoming show '{}' into DB: {}",
                                show.title,
                                e
                            );
                        } else {
                            log::info!(
                                "[P2P Receiver] Successfully registered incoming show '{}' into DB!",
                                show.title
                            );
                        }
                    }
                }
            }
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
            active.speed_bytes_per_sec = 0.0;
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
        speed_bytes_per_sec: 0.0,
    });
    drop(state);

    let sender_ip = pending
        .sender_ips
        .first()
        .map(|s| s.as_str())
        .unwrap_or("127.0.0.1")
        .to_string();
    let sender_port: u16 = pending.sender_port;

    let res = match connect_to_sender(&sender_ip, sender_port) {
        Ok(mut stream) => {
            if let Err(e) = send_receiver_handshake(&mut stream, &pending.id, &me) {
                log::error!("[P2P Receiver] Handshake failed: {}", e);
                Err(e)
            } else if let Err(e) = receive_file_transfer(
                &mut stream,
                &pending.sender_name,
                &pending.id,
                pending.files.len(),
                start_time,
            ) {
                log::error!("[P2P Receiver] File receiving failed: {}", e);
                Err(e)
            } else {
                Ok(())
            }
        }
        Err(e) => {
            log::error!("[P2P Receiver] Connection failed: {}", e);
            Err(e)
        }
    };

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
        Err(e) => {
            if e.contains("cancelled") {
                "CANCELLED".to_string()
            } else {
                "FAILED".to_string()
            }
        }
    };

    let failure_reason = match &res {
        Ok(_) => None,
        Err(e) => Some(e.clone()),
    };

    crate::dusty::p2p::history::create_and_record_history(
        pending.id.clone(),
        "incoming".to_string(),
        "receiver".to_string(),
        pending.items.clone(),
        pending.files.clone(),
        pending.sender_name.clone(),
        Some(sender_ip),
        pending.created_at,
        status_str,
        failure_reason,
        total_bytes,
        duration_secs,
    );

    if res.is_err() {
        if let Ok(mut state) = P2P_STATE.lock() {
            state.mode = "receive".to_string();
            state.active_transfer = None;
        }
    }
    res
}
