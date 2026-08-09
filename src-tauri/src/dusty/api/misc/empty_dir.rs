use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::misc::{add_or_update_empty_dir_cache, get_empty_dir_cache, reset_empty_dir_cache};
use crate::dusty::engine::dusty::empty_dir::list_empty_dirs;
use crate::dusty::logger::logger;
use rusqlite::Connection;
use std::sync::{Arc, Mutex};

use crate::dusty::multithreading::DbWorker;

pub fn scan_empty_dir_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        if let Ok(Ok(cached_files)) = db_worker.run_sync(|conn| get_empty_dir_cache(conn)) {
            if !cached_files.is_empty() {
                logger::debug!("scanned empty dirs from cache:", cached_files.len());
                return cached_files;
            }
        }
    }

    let files = list_empty_dirs();
    
    let files_clone = files.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_empty_dir_cache(conn) {
            logger::error!("RESET_EMPTY_DIR_CACHE_FAILED", err.log_details());
        }
        
        for file in &files_clone {
            if let Err(err) = add_or_update_empty_dir_cache(conn, file) {
                logger::error!("ADD_EMPTY_DIR_CACHE_FAILED", err.log_details());
            }
        }
    });
    
    files
}

#[tauri::command]
pub async fn scan_empty_dir(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_empty_dir", move || {
            scan_empty_dir_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_empty_dir(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_empty_dir", move || {
            scan_empty_dir_using_cache(&db_worker, false)
        })
        .await
}
