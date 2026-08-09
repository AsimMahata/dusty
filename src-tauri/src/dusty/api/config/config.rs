use crate::dusty::{
    config::{get_config_value_from_file, set_config_value_in_file, reset_config_file},
    logger::logger,
};

#[tauri::command]
pub async fn get_config_value(
    app_handle: tauri::AppHandle,
    id: String,
) -> Result<Option<String>, String> {
    get_config_value_from_file(&app_handle, id).map_err(|e| {
        logger::error!("GET_CONFIG_VALUE_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub async fn add_or_update_config_value(
    app_handle: tauri::AppHandle,
    id: String,
    value: String,
) -> Result<(), String> {
    set_config_value_in_file(&app_handle, id, value).map_err(|e| {
        logger::error!("ADD_OR_UPDATE_CONFIG_VALUE_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub async fn reset_config(app_handle: tauri::AppHandle) -> Result<(), String> {
    reset_config_file(&app_handle).map_err(|e| {
        logger::error!("RESET_CONFIG_FAILED", e.log_details());
        e.to_user_message()
    })
}
