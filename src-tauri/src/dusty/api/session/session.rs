use crate::dusty::{
    data::state::AppState,
    db::session::{
        add_or_update_by_session_id_in_db, get_value_by_session_id_in_db,
        reset_session_cache as reset_session_cache_in_db,
    },
};

use crate::dusty::logger::logger;

#[tauri::command]
pub fn get_value_by_session_id(
    state: tauri::State<AppState>,
    id: String,
) -> Result<String, String> {
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    get_value_by_session_id_in_db(&db, id)
}

#[tauri::command]
pub fn add_or_update_by_session_id(
    state: tauri::State<AppState>,
    id: String,
    value: String,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    add_or_update_by_session_id_in_db(&db, id, value)
}

#[tauri::command]
pub fn reset_session_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    reset_session_cache_in_db(&db)
}
