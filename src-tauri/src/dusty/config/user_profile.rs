use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use crate::dusty::models::user::User;
use chrono::Utc;
use std::env;
use std::fs;
use std::path::PathBuf;
use sysinfo::System;
use uuid::Uuid;

pub fn get_user_info_file_path() -> Result<PathBuf> {
    let home_dir = dirs::home_dir().ok_or_else(|| {
        DustyError::io_op(
            "get_home_dir",
            std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "Could not determine home directory",
            ),
        )
    })?;

    let user_dir = home_dir.join(".dusty").join("user");

    Ok(user_dir.join("user.json"))
}

pub fn create_default_user_info() -> User {
    let id = Uuid::new_v4().to_string();
    let display_name = env::var("USERNAME")
        .or_else(|_| env::var("USER"))
        .unwrap_or_else(|_| "Dusty User".to_string());

    let hostname = System::host_name().unwrap_or_else(|| "Unknown".to_string());
    let device_name = System::host_name().unwrap_or_else(|| "Unknown Device".to_string());
    let now = Utc::now().timestamp();

    User {
        id,
        display_name,
        avatar: None,
        hostname,
        device_name,
        created_at: now,
        updated_at: now,
    }
}

pub fn get_user_info() -> Result<User> {
    let path = get_user_info_file_path()?;
    if !path.exists() {
        let user = create_default_user_info();
        save_user_info(&user)?;
        return Ok(user);
    }

    let content =
        fs::read_to_string(&path).map_err(|e| DustyError::io("read_user_info_file", &path, e))?;

    if content.trim().is_empty() {
        let user = create_default_user_info();
        save_user_info(&user)?;
        return Ok(user);
    }

    let user: User = serde_json::from_str(&content)
        .map_err(|e| DustyError::serde("deserialize_user_info", e))?;

    Ok(user)
}

pub fn save_user_info(user: &User) -> Result<()> {
    let path = get_user_info_file_path()?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| DustyError::io("create_user_directory", parent, e))?;
    }

    let formatted = serde_json::to_string_pretty(user)
        .map_err(|e| DustyError::serde("serialize_user_info", e))?;

    fs::write(&path, formatted).map_err(|e| DustyError::io("write_user_info_file", &path, e))?;

    Ok(())
}

pub fn update_display_name_in_file(display_name: String) -> Result<User> {
    let mut user = get_user_info()?;
    user.display_name = display_name;
    user.updated_at = Utc::now().timestamp();
    save_user_info(&user)?;
    Ok(user)
}

pub fn update_avatar_in_file(avatar: Option<String>) -> Result<User> {
    let mut user = get_user_info()?;
    user.avatar = avatar;
    user.updated_at = Utc::now().timestamp();
    save_user_info(&user)?;
    Ok(user)
}

pub fn reset_user_info() -> Result<User> {
    let path = get_user_info_file_path()?;
    if path.exists() {
        let _ = fs::remove_file(&path);
    }
    let user = create_default_user_info();
    save_user_info(&user)?;
    Ok(user)
}
