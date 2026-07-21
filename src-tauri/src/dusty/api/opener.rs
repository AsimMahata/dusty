use std::process::Command;
use tauri::AppHandle;
use tauri_plugin_opener::OpenerExt;

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
    #[cfg(target_os = "windows")]
    let check_cmd = "where";
    #[cfg(not(target_os = "windows"))]
    let check_cmd = "which";

    let output = Command::new(check_cmd)
        .arg("code")
        .output()
        .map_err(|e| format!("Failed to locate 'code': {}", e))?;

    if !output.status.success() {
        return Err(
            "VS Code CLI ('code') is not available. Please install the 'code' command or add it to PATH."
                .to_string(),
        );
    }
    logger::debug!("VS_CODE_LOCATION", output);

    // On Windows, the 'code' CLI is typically a batch script (code.cmd)
    // so we must execute it via cmd.exe to prevent 'os error 193'
    #[cfg(target_os = "windows")]
    Command::new("cmd")
        .args(["/C", "code", &path])
        .spawn()
        .map_err(|e| format!("Failed to launch VS Code: {}", e))?;

    #[cfg(not(target_os = "windows"))]
    Command::new("code")
        .arg(&path)
        .spawn()
        .map_err(|e| format!("Failed to launch VS Code: {}", e))?;

    Ok(())
}
