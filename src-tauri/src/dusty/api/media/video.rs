use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::error::{DustyError, Result as DustyResult};
use crate::dusty::logger::logger;
use crate::dusty::scanners::dfs::dfs_file_of_type;
use crate::dusty::utility::info::is_root;
use crate::dusty::utility::sha256_hash::get_sha256_id;
use mime_guess::mime;
use rusqlite::{params, Connection};
use std::path::PathBuf;

#[tauri::command]
pub fn scan_video(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_video_using_cache(&state, &path, true)
}

#[tauri::command]
pub fn sync_scan_video(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_video_using_cache(&state, &path, false)
}

pub fn scan_video_using_cache(
    state: &tauri::State<AppState>,
    path: &String,
    cache: bool,
) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("scan_video_using_cache");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    if cache {
        if let Ok(Some(cached_videos)) = get_cached_videos_from_media_cache_db(&db, path) {
            logger::info!("VIDEO_CACHE_LOADED", cached_videos.len());
            if !cached_videos.is_empty() {
                logger::info!("VIDEO_CACHE_NOT_EMPTY", cached_videos.len());
                return cached_videos;
            }
            logger::info!("VIDEO_CACHE_IS_EMPTY", cached_videos.len());
        }
    }
    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::VIDEO, &mut list, is_root(&root));
    logger::info!("media found", list.len());

    let file_info_list: Vec<FileInfo> = list
        .into_iter()
        .filter_map(|p| FileInfo::from_pathbuf(&p).ok())
        .collect();

    if let Err(err) = add_videos_in_media_cache_table(&db, path, &file_info_list) {
        logger::warning!("ADD_VIDEOS_IN_CACHE_ERROR", err.log_details());
    }

    file_info_list
}

fn get_cached_videos_from_media_cache_db(db: &Connection, path: &String) -> DustyResult<Option<Vec<FileInfo>>> {
    let id = get_sha256_id(path.clone(), "flat_video".to_string());
    let res = db.query_row(
        "SELECT data FROM media_cache WHERE id=?1",
        params![id],
        |row| row.get::<_, String>(0),
    );

    match res {
        Ok(data) => {
            let videos: Vec<FileInfo> = serde_json::from_str(&data)
                .map_err(|e| DustyError::serde("deserialize_cached_videos", e))?;
            Ok(Some(videos))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(DustyError::db("get_cached_videos", Some("media_cache".to_string()), err)),
    }
}

pub fn add_videos_in_media_cache_table(
    db: &Connection,
    path: &String,
    videos: &Vec<FileInfo>,
) -> DustyResult<()> {
    let id = get_sha256_id(path.clone(), "flat_video".to_string());
    let data: String = serde_json::to_string(&videos)
        .map_err(|e| DustyError::serde("serialize_video_cache", e))?;
    db.execute(
        "INSERT OR REPLACE INTO media_cache(id, source, media_type, data) VALUES (?1, ?2, ?3, ?4)",
        params![id, path, "flat_video", data],
    )
    .map_err(|err| DustyError::db("add_videos_to_cache", Some("media_cache".to_string()), err))?;

    Ok(())
}
