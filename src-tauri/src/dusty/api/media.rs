use crate::dusty::{
    data::{media::MediaDir, state::AppState},
    db::media::{
        get_media_from_db, reset_media_cache_table_in_db, save_media_to_db, sync_media_to_db,
    },
    scanners::media::dfs_media_dir_scanner,
    utility::info::is_root,
};
use mime_guess::mime;
use std::path::PathBuf;

#[tauri::command]
pub fn get_media_of_type(
    path: String,
    media_type: String,
    state: tauri::State<AppState>,
) -> Result<Vec<MediaDir>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    if let Ok(Some(cached_media)) = get_media_from_db(&db, &path, &media_type) {
        crate::dusty::logger::logger::info!("MEDIA_TREE_CACHE_LOADED", cached_media.len());
        if !cached_media.is_empty() {
            crate::dusty::logger::logger::info!("MEDIA_TREE_CACHE_NOT_EMPTY", cached_media.len());
            return Ok(cached_media);
        }
        crate::dusty::logger::logger::info!("MEDIA_TREE_CACHE_IS_EMPTY", cached_media.len());
    }

    let root = PathBuf::from(&path);
    let mime_type = match media_type.as_str() {
        "music" => mime::AUDIO,
        "video" => mime::VIDEO,
        "image" => mime::IMAGE,
        _ => return Err("Invalid media type".to_string()),
    };

    let mut media_dirs = Vec::new();
    dfs_media_dir_scanner(&root, &mut media_dirs, is_root(&root), mime_type);

    let _ = save_media_to_db(&db, &path, &media_type, &media_dirs);
    Ok(media_dirs)
}

#[tauri::command]
pub fn sync_media_database(
    state: tauri::State<AppState>,
    path: String,
    media_type: String,
) -> Result<Vec<MediaDir>, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let root = PathBuf::from(&path);
    let mime_type = match media_type.as_str() {
        "music" => mime::AUDIO,
        "video" => mime::VIDEO,
        "image" => mime::IMAGE,
        _ => return Err("Invalid media type".to_string()),
    };

    let mut media_dirs = Vec::new();
    dfs_media_dir_scanner(&root, &mut media_dirs, is_root(&root), mime_type);

    sync_media_to_db(&db, &path, &media_type, &media_dirs).ok();
    Ok(media_dirs)
}

#[tauri::command]
pub fn reset_media_cache_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    reset_media_cache_table_in_db(&db).map_err(|e| e.to_string())?;
    Ok(())
}

