use crate::dusty::{
    data::state::AppState,
    db::session::{
        add_or_update_by_session_id_in_db, get_value_by_session_id_in_db,
        reset_session_cache as reset_session_cache_in_db,
    },
    logger::logger,
};

#[tauri::command]
pub async fn get_value_by_session_id(
    state: tauri::State<'_, AppState>,
    id: String,
) -> Result<String, String> {
    state
        .db_worker
        .run(move |conn| {
            get_value_by_session_id_in_db(conn, id).map_err(|e| {
                logger::error!("GET_VALUE_BY_SESSION_ID_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn add_or_update_by_session_id(
    state: tauri::State<'_, AppState>,
    id: String,
    value: String,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            add_or_update_by_session_id_in_db(conn, id, value).map_err(|e| {
                logger::error!("ADD_OR_UPDATE_BY_SESSION_ID_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn reset_session_cache(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            reset_session_cache_in_db(conn).map_err(|e| {
                logger::error!("RESET_SESSION_CACHE_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}
