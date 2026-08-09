use crate::dusty::models::state::AppState;
use crate::dusty::db::recent::{
    VideoItem, add_recent_episode_in_db, get_recent_episodes_from_db, reset_recent_episodes_table_in_db,
};

use crate::dusty::logger::logger;

#[tauri::command]
pub async fn add_recent_episode(
    state: tauri::State<'_, AppState>,
    video: VideoItem,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            add_recent_episode_in_db(conn, video).map_err(|e| {
                logger::error!("ADD_RECENT_EPISODE_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn get_recent_episodes(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<VideoItem>, String> {
    state
        .db_worker
        .run(|conn| {
            get_recent_episodes_from_db(conn).map_err(|e| {
                logger::error!("GET_RECENT_EPISODES_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn reset_recent_episodes_table(
    state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_recent_episodes_table_in_db(conn).map_err(|e| {
                logger::error!("RESET_RECENT_EPISODES_TABLE_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}
