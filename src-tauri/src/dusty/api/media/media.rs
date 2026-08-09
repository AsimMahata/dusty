use crate::dusty::{
    data::{media::MediaDir, state::AppState},
    db::media::{
        get_media_from_db, reset_media_cache_table_in_db, save_media_to_db, sync_media_to_db,
    },
    error::DustyError,
    logger::logger,
    scanners::media::dfs_media_dir_scanner,
    utility::info::is_root,
};
use mime_guess::mime;
use std::path::PathBuf;

#[tauri::command]
pub async fn get_media_of_type(
    path: String,
    media_type: String,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<MediaDir>, String> {
    let path_clone = path.clone();
    let media_type_clone = media_type.clone();
    if let Ok(Ok(Some(cached_media))) = state
        .db_worker
        .run(move |conn| get_media_from_db(conn, &path_clone, &media_type_clone))
        .await
    {
        logger::info!("MEDIA_TREE_CACHE_LOADED", cached_media.len());
        if !cached_media.is_empty() {
            logger::info!("MEDIA_TREE_CACHE_NOT_EMPTY", cached_media.len());
            return Ok(cached_media);
        }
        logger::info!("MEDIA_TREE_CACHE_IS_EMPTY", cached_media.len());
    }

    let root = PathBuf::from(&path);
    let mime_type = match media_type.as_str() {
        "music" => mime::AUDIO,
        "video" => mime::VIDEO,
        "image" => mime::IMAGE,
        _ => {
            let err = DustyError::Custom(format!("Invalid media type '{}'", media_type));
            logger::error!("GET_MEDIA_OF_TYPE_FAILED", err.log_details());
            return Err(err.to_user_message());
        }
    };

    let mut media_dirs = Vec::new();
    dfs_media_dir_scanner(&root, &mut media_dirs, is_root(&root), mime_type);

    let path_clone = path.clone();
    let media_type_clone = media_type.clone();
    let media_dirs_clone = media_dirs.clone();
    let _ = state
        .db_worker
        .run(move |conn| {
            if let Err(err) = save_media_to_db(conn, &path_clone, &media_type_clone, &media_dirs_clone) {
                logger::error!("SAVE_MEDIA_TO_DB_FAILED", err.log_details());
            }
        })
        .await;

    Ok(media_dirs)
}

#[tauri::command]
pub async fn sync_media_database(
    state: tauri::State<'_, AppState>,
    path: String,
    media_type: String,
) -> Result<Vec<MediaDir>, String> {
    let root = PathBuf::from(&path);
    let mime_type = match media_type.as_str() {
        "music" => mime::AUDIO,
        "video" => mime::VIDEO,
        "image" => mime::IMAGE,
        _ => {
            let err = DustyError::Custom(format!("Invalid media type '{}'", media_type));
            logger::error!("SYNC_MEDIA_DATABASE_FAILED", err.log_details());
            return Err(err.to_user_message());
        }
    };

    let mut media_dirs = Vec::new();
    dfs_media_dir_scanner(&root, &mut media_dirs, is_root(&root), mime_type);

    let path_clone = path.clone();
    let media_type_clone = media_type.clone();
    let media_dirs_clone = media_dirs.clone();
    let _ = state
        .db_worker
        .run(move |conn| {
            if let Err(err) = sync_media_to_db(conn, &path_clone, &media_type_clone, &media_dirs_clone) {
                logger::error!("SYNC_MEDIA_TO_DB_FAILED", err.log_details());
            }
        })
        .await;

    Ok(media_dirs)
}

#[tauri::command]
pub async fn reset_media_cache_table(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_media_cache_table_in_db(conn).map_err(|e| {
                logger::error!("RESET_MEDIA_CACHE_TABLE_FAILED", e.log_details());
                e.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}
