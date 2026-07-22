use crate::dusty::{
    data::state::AppState,
    db::session_cache::{
        add_or_update_by_session_id_in_db, get_value_by_session_id_in_db,
        reset_session_cache as reset_session_cache_in_db,
    },
};

#[tauri::command]
pub fn get_value_by_session_id(
    state: tauri::State<AppState>,
    id: String,
) -> Result<String, String> {
    let db = state.db.lock().unwrap();
    get_value_by_session_id_in_db(&db, id)
}

#[tauri::command]
pub fn add_or_update_by_session_id(
    state: tauri::State<AppState>,
    id: String,
    value: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    add_or_update_by_session_id_in_db(&db, id, value)
}

#[tauri::command]
pub fn reset_session_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    reset_session_cache_in_db(&db)
}
