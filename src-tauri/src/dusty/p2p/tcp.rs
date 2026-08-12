use std::io::Read;
use std::io::Write;
use std::net::TcpListener;
use std::net::TcpStream;

use crate::dusty::p2p::P2P_STATE;

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
            let fallback_port = tcp_port.saturating_add(5);
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

pub fn send_cancel_signal_with_reason(stream: &mut TcpStream, reason: &str) {
    let msg = format!("CANCEL:{}\n", reason);
    stream.write_all(msg.as_bytes()).ok();
    stream.flush().ok();
    let mut ack_buf = [0u8; 64];
    let _ = stream.read(&mut ack_buf);
}

pub fn send_cancel_signal_and_reset_state(stream: &mut TcpStream, msg: &str) -> String {
    send_cancel_signal_with_reason(stream, msg);
    if let Ok(mut state) = P2P_STATE.lock() {
        state.mode = "send".to_string();
        state.active_transfer = None;
    }
    msg.to_string()
}

pub fn read_header_line(stream: &mut TcpStream) -> Result<String, String> {
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

pub fn send_cancel_signal_and_wait_ack(stream: &mut TcpStream) {
    send_cancel_signal_with_reason(stream, "Transfer cancelled");
}
