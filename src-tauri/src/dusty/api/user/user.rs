use crate::dusty::config::user_profile::get_user_info;
use crate::dusty::config::user_profile::reset_user_info;
use crate::dusty::config::user_profile::save_user_info;
use crate::dusty::config::user_profile::update_avatar_in_file;
use crate::dusty::config::user_profile::update_display_name_in_file;
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;
use crate::dusty::models::user::DeviceInfo;
use crate::dusty::models::user::User;
use sysinfo::System;
use tauri::AppHandle;

#[tauri::command]
pub fn get_user() -> Result<User, String> {
    get_user_info().map_err(|e| {
        logger::error!("GET_USER_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn save_user(user: User) -> Result<(), String> {
    save_user_info(&user).map_err(|e| {
        logger::error!("SAVE_USER_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn update_display_name(display_name: String) -> Result<User, String> {
    update_display_name_in_file(display_name).map_err(|e| {
        logger::error!("UPDATE_DISPLAY_NAME_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn update_avatar(avatar: Option<String>) -> Result<User, String> {
    update_avatar_in_file(avatar).map_err(|e| {
        logger::error!("UPDATE_AVATAR_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn reset_user() -> Result<User, String> {
    reset_user_info().map_err(|e| {
        logger::error!("RESET_USER_FAILED", e.log_details());
        e.to_user_message()
    })
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

    match file {
        Some(path) => {
            let path_str = path.to_str().ok_or_else(|| {
                let err = DustyError::invalid_path(&path, "Avatar image path is not valid UTF-8");
                logger::error!("SELECT_AVATAR_FILE_FAILED", err.log_details());
                err.to_user_message()
            })?;
            Ok(Some(path_str.to_string()))
        }
        None => Ok(None),
    }
}

#[tauri::command]
pub fn upload_avatar_from_path(app_handle: AppHandle, file_path: String) -> Result<User, String> {
    use tauri::Manager;
    let path = std::path::Path::new(&file_path);
    if !path.exists() {
        let err = DustyError::invalid_path(path, "File does not exist");
        logger::error!("UPLOAD_AVATAR_FAILED", err.log_details());
        return Err(err.to_user_message());
    }

    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .ok_or_else(|| {
            let err = DustyError::invalid_path(path, "File has no extension");
            logger::error!("UPLOAD_AVATAR_FAILED", err.log_details());
            err.to_user_message()
        })?;

    if !matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "webp" | "gif") {
        let err = DustyError::invalid_path(path, "Unsupported image file format");
        logger::error!("UPLOAD_AVATAR_FAILED", err.log_details());
        return Err(err.to_user_message());
    }

    let home_dir = app_handle.path().home_dir().map_err(|e| {
        let err = DustyError::io_op(
            "get_home_dir",
            std::io::Error::new(std::io::ErrorKind::Other, e.to_string()),
        );
        logger::error!("UPLOAD_AVATAR_FAILED", err.log_details());
        err.to_user_message()
    })?;

    let user_dir = home_dir.join(".dusty").join("user");
    std::fs::create_dir_all(&user_dir).map_err(|e| {
        let err = DustyError::io("create_user_directory", &user_dir, e);
        logger::error!("UPLOAD_AVATAR_FAILED", err.log_details());
        err.to_user_message()
    })?;

    let target_filename = format!("avatar.{}", ext);
    let target_path = user_dir.join(target_filename);

    std::fs::copy(path, &target_path).map_err(|e| {
        let err = DustyError::io("copy_avatar", &target_path, e);
        logger::error!("COPY_AVATAR_FAILED", err.log_details());
        err.to_user_message()
    })?;

    let target_path_str = target_path
        .to_str()
        .ok_or_else(|| {
            let err =
                DustyError::invalid_path(&target_path, "Target avatar path is not valid UTF-8");
            logger::error!("COPY_AVATAR_FAILED", err.log_details());
            err.to_user_message()
        })?
        .to_string();

    update_avatar_in_file(Some(target_path_str)).map_err(|e| {
        logger::error!("UPDATE_AVATAR_FAILED", e.log_details());
        e.to_user_message()
    })
}
