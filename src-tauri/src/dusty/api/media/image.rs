use crate::dusty::models::file::FileInfo;
use crate::dusty::models::state::AppState;
use crate::dusty::error::{DustyError, Result as DustyResult};
use crate::dusty::logger::logger;
use crate::dusty::scanners::dfs::dfs_file_of_type;
use crate::dusty::utility::info::is_root;
use crate::dusty::utility::sha256_hash::get_sha256_id;
use mime_guess::mime;
use rusqlite::{params, Connection};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use crate::dusty::multithreading::DbWorker;

#[tauri::command]
pub async fn scan_image(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_image", move || {
            scan_image_using_cache(&db_worker, &path, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_image(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_image", move || {
            scan_image_using_cache(&db_worker, &path, false)
        })
        .await
}

pub fn scan_image_using_cache(
    db_worker: &DbWorker,
    path: &String,
    cache: bool,
) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);
    if cache {
        let path_clone = path.clone();
        if let Ok(Ok(Some(cached_image))) = db_worker.run_sync(move |conn| {
            get_cached_image_from_media_cache_db(conn, &path_clone)
        }) {
            logger::info!("IMAGE_CACHE_LOADED", cached_image.len());
            if !cached_image.is_empty() {
                logger::info!("IMAGE_CACHE_NOT_EMPTY", cached_image.len());
                return cached_image;
            }
            logger::info!("IMAGE_CACHE_IS_EMPTY", cached_image.len());
        }
    }

    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::IMAGE, &mut list, is_root(&root));
    logger::info!("media found", list.len());

    let file_info_list: Vec<FileInfo> = list
        .into_iter()
        .filter_map(|p| FileInfo::from_pathbuf(&p).ok())
        .collect();

    let path_clone = path.clone();
    let file_info_clone = file_info_list.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = add_image_in_media_cache_table(conn, &path_clone, &file_info_clone) {
            logger::warning!("ADD_IMAGE_IN_CACHE_ERROR", err.log_details());
        }
    });

    file_info_list
}

#[tauri::command]
pub async fn scan_image_cached(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<Vec<FileInfo>, String> {
    scan_image(state, path).await
}

#[tauri::command]
pub async fn scan_image_no_cache(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<Vec<FileInfo>, String> {
    sync_scan_image(state, path).await
}

fn get_cached_image_from_media_cache_db(db: &Connection, path: &String) -> DustyResult<Option<Vec<FileInfo>>> {
    let id = get_sha256_id(path.clone(), "flat_image".to_string());
    let res = db.query_row(
        "SELECT data FROM media_cache WHERE id=?1",
        params![id],
        |row| row.get::<_, String>(0),
    );

    match res {
        Ok(data) => {
            let images: Vec<FileInfo> = serde_json::from_str(&data)
                .map_err(|e| DustyError::serde("deserialize_cached_images", e))?;
            Ok(Some(images))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(DustyError::db("get_cached_images", Some("media_cache".to_string()), err)),
    }
}

pub fn add_image_in_media_cache_table(
    db: &Connection,
    path: &String,
    images: &Vec<FileInfo>,
) -> DustyResult<()> {
    let id = get_sha256_id(path.clone(), "flat_image".to_string());
    let data: String = serde_json::to_string(&images)
        .map_err(|e| DustyError::serde("serialize_image_cache", e))?;
    db.execute(
        "INSERT OR REPLACE INTO media_cache(id, source, media_type, data) VALUES (?1, ?2, ?3, ?4)",
        params![id, path, "flat_image", data],
    )
    .map_err(|err| DustyError::db("add_images_to_cache", Some("media_cache".to_string()), err))?;

    Ok(())
}
