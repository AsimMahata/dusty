use crate::dusty::{
    data::{
        state::AppState,
        user::{User, DeviceInfo},
    },
    db::user::{
        get_user_in_db, save_user_in_db, update_display_name_in_db,
        update_avatar_in_db, reset_user_in_db,
    },
    error::DustyError,
    logger::logger,
};
use tauri::State;
use sysinfo::System;

#[tauri::command]
pub async fn get_user(state: State<'_, AppState>) -> Result<User, String> {
    state
        .db_worker
        .run(|conn| {
            get_user_in_db(conn).map_err(|e| {
                logger::error!("GET_USER_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn save_user(state: State<'_, AppState>, user: User) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            save_user_in_db(conn, &user).map_err(|e| {
                logger::error!("SAVE_USER_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn update_display_name(
    state: State<'_, AppState>,
    display_name: String,
) -> Result<User, String> {
    state
        .db_worker
        .run(move |conn| {
            update_display_name_in_db(conn, display_name).map_err(|e| {
                logger::error!("UPDATE_DISPLAY_NAME_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn update_avatar(
    state: State<'_, AppState>,
    avatar: Option<String>,
) -> Result<User, String> {
    state
        .db_worker
        .run(move |conn| {
            update_avatar_in_db(conn, avatar).map_err(|e| {
                logger::error!("UPDATE_AVATAR_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn reset_user(state: State<'_, AppState>) -> Result<User, String> {
    state
        .db_worker
        .run(|conn| {
            reset_user_in_db(conn).map_err(|e| {
                logger::error!("RESET_USER_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
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
pub async fn upload_avatar_from_path(
    state: State<'_, AppState>,
    app_handle: tauri::AppHandle,
    file_path: String,
) -> Result<User, String> {
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

    let home_dir = app_handle
        .path()
        .home_dir()
        .map_err(|e| {
            let err = DustyError::io_op("get_home_dir", std::io::Error::new(std::io::ErrorKind::Other, e.to_string()));
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

    let target_path_str = target_path.to_str().ok_or_else(|| {
        let err = DustyError::invalid_path(&target_path, "Target avatar path is not valid UTF-8");
        logger::error!("COPY_AVATAR_FAILED", err.log_details());
        err.to_user_message()
    })?.to_string();

    state
        .db_worker
        .run(move |conn| {
            update_avatar_in_db(conn, Some(target_path_str)).map_err(|e| {
                logger::error!("UPDATE_AVATAR_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}
