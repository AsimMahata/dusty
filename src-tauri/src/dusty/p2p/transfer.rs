use crate::dusty::p2p::send_cancel_signal_and_reset_state;
use crate::dusty::p2p::CANCEL_FLAG;
use crate::dusty::p2p::P2P_STATE;
use std::io::Read;
use std::io::Write;
use std::net::TcpStream;
use std::time::Instant;

pub fn is_transfer_cancelled() -> bool {
    CANCEL_FLAG.load(std::sync::atomic::Ordering::Relaxed)
}

pub fn set_transfer_cancelled(val: bool) {
    CANCEL_FLAG.store(val, std::sync::atomic::Ordering::Relaxed);
}
pub fn check_for_already_transfering() -> Result<(), String> {
    let mut state = P2P_STATE.lock().map_err(|e| e.to_string())?;

    if state.mode == "transfer" || state.active_transfer.is_some() {
        log::warn!(
            "[P2P API] Transfer already in progress. Ignoring duplicate accept_transfer call."
        );

        return Err(
            "Transfer already in progress. Ignoring duplicate accept_transfer call".to_string(),
        );
    }

    state.mode = "transfer".to_string();
    drop(state);

    Ok(())
}
pub fn send_single_file(
    stream: &mut TcpStream,
    file_idx: usize,
    files_count: usize,
    file_path: &str,
    file_size: u64,
    total_bytes_all_files: u64,
    total_bytes_sent_cumulative: &mut u64,
    buffer: &mut [u8],
    last_speed_check: &mut std::time::Instant,
    bytes_at_last_check: &mut u64,
) -> Result<(), String> {
    if is_transfer_cancelled() {
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
        if is_transfer_cancelled() {
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

        let elapsed = last_speed_check.elapsed();
        let mut speed_to_update: Option<f64> = None;
        if elapsed >= std::time::Duration::from_millis(500) {
            let bytes_in_interval =
                total_bytes_sent_cumulative.saturating_sub(*bytes_at_last_check);
            let elapsed_secs = elapsed.as_secs_f64();
            let current_speed = if elapsed_secs > 0.0 {
                (bytes_in_interval as f64) / elapsed_secs
            } else {
                0.0
            };
            speed_to_update = Some(current_speed);
            *last_speed_check = std::time::Instant::now();
            *bytes_at_last_check = *total_bytes_sent_cumulative;
        }

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
                if let Some(spd) = speed_to_update {
                    active.speed_bytes_per_sec = spd;
                }
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
        log::info!(
            "[P2P Sender] Transmitting TCP MANIFEST header ({} files, {} total bytes)",
            manifest.files.len(),
            manifest.total_bytes
        );
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
    let mut last_speed_check = std::time::Instant::now();
    let mut bytes_at_last_check: u64 = 0;
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
            &mut last_speed_check,
            &mut bytes_at_last_check,
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
            active.speed_bytes_per_sec = 0.0;
        }
    }

    log::info!(
        "[P2P Engine] All files transferred successfully for session key {}",
        transfer_key
    );
    Ok(())
}
