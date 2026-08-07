use crate::dusty::{
    data::{
        state::AppState,
        user::{User, DeviceInfo},
    },
    db::user::{
        get_user_in_db, save_user_in_db, update_display_name_in_db,
        update_avatar_in_db, reset_user_in_db,
    },
};
use tauri::State;
use sysinfo::System;

#[tauri::command]
pub fn get_user(state: State<AppState>) -> Result<User, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    get_user_in_db(&db)
}

#[tauri::command]
pub fn save_user(state: State<AppState>, user: User) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    save_user_in_db(&db, &user)
}

#[tauri::command]
pub fn update_display_name(state: State<AppState>, display_name: String) -> Result<User, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    update_display_name_in_db(&db, display_name)
}

#[tauri::command]
pub fn update_avatar(state: State<AppState>, avatar: Option<String>) -> Result<User, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    update_avatar_in_db(&db, avatar)
}

#[tauri::command]
pub fn reset_user(state: State<AppState>) -> Result<User, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    reset_user_in_db(&db)
}

#[tauri::command]
pub fn get_device_info() -> Result<DeviceInfo, String> {
    let hostname = System::host_name().unwrap_or_else(|| "Unknown".to_string());
    let os = format!(
        "{} {}",
        System::name().unwrap_or_else(|| "Unknown".to_string()),
        System::os_version().unwrap_or_default()
    )
    .trim()
    .to_string();
    let device_name = System::host_name().unwrap_or_else(|| "Unknown Device".to_string());

    Ok(DeviceInfo {
        hostname,
        os,
        device_name,
    })
}

#[tauri::command]
pub fn select_avatar_file() -> Result<Option<String>, String> {
    let file = rfd::FileDialog::new()
        .add_filter("Images", &["jpg", "jpeg", "png", "webp", "gif"])
        .pick_file();
    
    Ok(file.map(|path| path.to_string_lossy().to_string()))
}

#[tauri::command]
pub fn upload_avatar_from_path(
    state: State<AppState>,
    app_handle: tauri::AppHandle,
    file_path: String,
) -> Result<User, String> {
    use tauri::Manager;
    let path = std::path::Path::new(&file_path);
    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    // Verify it is an image
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .ok_or_else(|| "File has no extension".to_string())?;

    if !matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "webp" | "gif") {
        return Err("Selected file is not a supported image".to_string());
    }

    // Get home directory (~/.dusty)
    let home_dir = app_handle
        .path()
        .home_dir()
        .map_err(|e| e.to_string())?;
    
    let user_dir = home_dir.join(".dusty").join("user");
    std::fs::create_dir_all(&user_dir).map_err(|e| e.to_string())?;

    // Copy to ~/.dusty/user/avatar.ext
    let target_filename = format!("avatar.{}", ext);
    let target_path = user_dir.join(target_filename);

    std::fs::copy(path, &target_path).map_err(|e| {
        let err_str = e.to_string();
        crate::dusty::logger::logger::error!("COPY_AVATAR_FAILED", err_str.clone());
        err_str
    })?;

    // Save path to user in database
    let target_path_str = target_path.to_string_lossy().to_string();
    let db = state.db.lock().map_err(|e| e.to_string())?;
    crate::dusty::db::user::update_avatar_in_db(&db, Some(target_path_str))
}

