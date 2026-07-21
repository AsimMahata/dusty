use crate::dusty::data::state::AppState;
use crate::dusty::db::recent::{
    VideoItem, add_recent_episode_in_db, get_recent_episodes_from_db, reset_recent_episodes_table_in_db,
};

#[tauri::command]
pub fn add_recent_episode(state:tauri::State<AppState>,video:VideoItem)->Result<(),String>{
    let db = state.db.lock().unwrap();
    add_recent_episode_in_db(&db,video)
}

#[tauri::command]
pub fn get_recent_episodes(state:tauri::State<AppState>)->Result<Vec<VideoItem>,String>{
    let db = state.db.lock().unwrap();
    get_recent_episodes_from_db(&db)
}   

#[tauri::command]
pub fn reset_recent_episodes_table(state:tauri::State<AppState>)->Result<(),String>{
    let db = state.db.lock().unwrap();
    reset_recent_episodes_table_in_db(&db)
}