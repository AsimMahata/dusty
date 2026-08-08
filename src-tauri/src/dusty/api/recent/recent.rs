use crate::dusty::data::state::AppState;
use crate::dusty::db::recent::{
    VideoItem, add_recent_episode_in_db, get_recent_episodes_from_db, reset_recent_episodes_table_in_db,
};

use crate::dusty::logger::logger;

#[tauri::command]
pub fn add_recent_episode(state:tauri::State<AppState>,video:VideoItem)->Result<(),String>{
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    add_recent_episode_in_db(&db,video)
}

#[tauri::command]
pub fn get_recent_episodes(state:tauri::State<AppState>)->Result<Vec<VideoItem>,String>{
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    get_recent_episodes_from_db(&db)
}   

#[tauri::command]
pub fn reset_recent_episodes_table(state:tauri::State<AppState>)->Result<(),String>{
    let db = state.db.lock().map_err(|e| {
        logger::error!("DB_LOCK_FAILED", e.to_string());
        e.to_string()
    })?;
    reset_recent_episodes_table_in_db(&db)
}

