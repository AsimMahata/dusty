use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use tauri::AppHandle;
use tauri_plugin_opener::OpenerExt;
use which::which;

use crate::dusty::logger::logger;

#[tauri::command]
pub fn open_file(app: AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(&path, None::<&str>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_url(app: AppHandle, url: String) -> Result<(), String> {
    app.opener()
        .open_url(url, None::<&str>)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_in_vs_code(path: String) -> Result<(), String> {
    // 1. Use the `which` crate to cleanly find the executable without spawning a process
    let mut code_path = which("code")
        .map_err(|_| "VS Code CLI ('code') is not available. Please install the 'code' command or add it to PATH.".to_string())?;

    // 2. On Windows, `which` usually finds `.../bin/code.cmd`
    // We can navigate up from `bin/code.cmd` to find the actual `Code.exe`
    // This allows us to bypass `cmd.exe` and batch scripts entirely!
    #[cfg(target_os = "windows")]
    if code_path.extension().and_then(|s| s.to_str()) == Some("cmd") {
        if let Some(parent) = code_path.parent().and_then(|p| p.parent()) {
            let exe_path = parent.join("Code.exe");
            if exe_path.exists() {
                code_path = exe_path;
            }
        }
    }

    logger::debug!("VS_CODE_LOCATION", code_path.to_string_lossy().to_string());

    let mut cmd = Command::new(&code_path);
    cmd.arg(&path);
    
    // We still keep this flag in case it falls back to the .cmd script for any reason
    #[cfg(target_os = "windows")]
    cmd.creation_flags(0x08000000);

    cmd.spawn().map_err(|e| format!("Failed to launch VS Code: {}", e))?;

    Ok(())
}
