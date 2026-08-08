use crate::dusty::{
    data::state::AppState,
    db::session::{
        add_or_update_by_session_id_in_db, get_value_by_session_id_in_db,
        reset_session_cache as reset_session_cache_in_db,
    },
    error::DustyError,
    logger::logger,
};

#[tauri::command]
pub fn get_value_by_session_id(
    state: tauri::State<AppState>,
    id: String,
) -> Result<String, String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("get_value_by_session_id");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    get_value_by_session_id_in_db(&db, id).map_err(|e| {
        logger::error!("GET_VALUE_BY_SESSION_ID_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn add_or_update_by_session_id(
    state: tauri::State<AppState>,
    id: String,
    value: String,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("add_or_update_by_session_id");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    add_or_update_by_session_id_in_db(&db, id, value).map_err(|e| {
        logger::error!("ADD_OR_UPDATE_BY_SESSION_ID_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn reset_session_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_session_cache");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    reset_session_cache_in_db(&db).map_err(|e| {
        logger::error!("RESET_SESSION_CACHE_FAILED", e.log_details());
        e.to_user_message()
    })
}
