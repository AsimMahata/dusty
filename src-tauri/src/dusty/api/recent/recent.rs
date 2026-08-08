use crate::dusty::data::state::AppState;
use crate::dusty::db::recent::{
    VideoItem, add_recent_episode_in_db, get_recent_episodes_from_db, reset_recent_episodes_table_in_db,
};
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn add_recent_episode(state: tauri::State<AppState>, video: VideoItem) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("add_recent_episode");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    add_recent_episode_in_db(&db, video).map_err(|e| {
        logger::error!("ADD_RECENT_EPISODE_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn get_recent_episodes(state: tauri::State<AppState>) -> Result<Vec<VideoItem>, String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("get_recent_episodes");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    get_recent_episodes_from_db(&db).map_err(|e| {
        logger::error!("GET_RECENT_EPISODES_FAILED", e.log_details());
        e.to_user_message()
    })
}   

#[tauri::command]
pub fn reset_recent_episodes_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_recent_episodes_table");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    reset_recent_episodes_table_in_db(&db).map_err(|e| {
        logger::error!("RESET_RECENT_EPISODES_TABLE_FAILED", e.log_details());
        e.to_user_message()
    })
}
