use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_opener::OpenerExt;
use which::which;

use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn open_file(app: AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(&path, None::<&str>)
        .map_err(|e| {
            let err = DustyError::io("open_file", PathBuf::from(&path), std::io::Error::new(std::io::ErrorKind::Other, e.to_string()));
            logger::error!("OPEN_FILE_FAILED", err.log_details());
            err.to_user_message()
        })
}

#[tauri::command]
pub fn open_url(app: AppHandle, url: String) -> Result<(), String> {
    app.opener()
        .open_url(url.clone(), None::<&str>)
        .map_err(|e| {
            let err = DustyError::Custom(format!("Failed to open URL '{}': {}", url, e));
            logger::error!("OPEN_URL_FAILED", err.log_details());
            err.to_user_message()
        })
}

#[tauri::command]
pub fn open_in_vs_code(path: String) -> Result<(), String> {
    let mut code_path = which("code")
        .map_err(|_| {
            let err = DustyError::Custom("VS Code CLI ('code') is not available in PATH".to_string());
            logger::error!("OPEN_IN_VS_CODE_FAILED", err.log_details());
            err.to_user_message()
        })?;

    #[cfg(target_os = "windows")]
    if code_path.extension().and_then(|s| s.to_str()) == Some("cmd") {
        if let Some(parent) = code_path.parent().and_then(|p| p.parent()) {
            let exe_path = parent.join("Code.exe");
            if exe_path.exists() {
                code_path = exe_path;
            }
        }
    }

    logger::debug!("VS_CODE_LOCATION", code_path.display().to_string());

    let mut cmd = Command::new(&code_path);
    cmd.arg(&path);
    
    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000);

    cmd.spawn().map_err(|e| {
        let err = DustyError::io("launch_vs_code", &code_path, e);
        logger::error!("LAUNCH_VS_CODE_FAILED", err.log_details());
        err.to_user_message()
    })?;

    Ok(())
}
