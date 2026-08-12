use crate::dusty::config::get_user_info;
use crate::dusty::p2p::Peer;
use crate::dusty::p2p::RECEIVER_TRANSFER_PORT;
use local_ip_address::local_ip;
use std::path::PathBuf;

pub fn get_my_peer_with_ip() -> Result<Peer, String> {
    let me = get_user_info().map_err(|e| e.to_user_message())?;

    let mut me_peer = Peer::peer_automatic_ip_address(
        me.id.parse().map_err(|e: uuid::Error| e.to_string())?,
        me.display_name.clone(),
        me.hostname.clone(),
        RECEIVER_TRANSFER_PORT,
    );

    if let Ok(ip) = local_ip() {
        me_peer.add_address(ip.to_string());
    } else {
        return Err("Failed to get local IP address".to_string());
    }

    Ok(me_peer)
}

pub fn select_files_using_window() -> Option<Vec<PathBuf>> {
    rfd::FileDialog::new()
        .set_title("Select Files to Send")
        .add_filter("All Files", &["*"])
        .pick_files()
}

pub fn get_valid_files(files: Option<Vec<PathBuf>>) -> Result<Vec<String>, String> {
    match files {
        Some(paths) => {
            let mut valid_files = Vec::new();

            for path in paths {
                if !path.exists() {
                    return Err(format!("File does not exist: {}", path.display()));
                }

                if !path.is_file() {
                    return Err(format!("Path is not a file: {}", path.display()));
                }

                if let Err(e) = std::fs::metadata(&path) {
                    return Err(format!(
                        "Cannot read file metadata for {}: {}",
                        path.display(),
                        e
                    ));
                }

                let path_str = path
                    .to_str()
                    .ok_or_else(|| format!("File path is not valid UTF-8: {}", path.display()))?;

                valid_files.push(path_str.to_string());
            }

            log::info!("[P2P API] Selected {} valid file(s)", valid_files.len());

            Ok(valid_files)
        }

        None => {
            log::info!("[P2P API] File selection cancelled by user");
            Ok(vec![])
        }
    }
}
