use crate::dusty::models::misc_dir::MiscDir;
use crate::dusty::models::file::FileInfo;
use crate::dusty::models::state::AppState;
use crate::dusty::db::misc::{add_or_update_misc_cache, get_misc_cache, reset_misc_cache};
use crate::dusty::db::misc::{get_misc_dir_cache, reset_misc_dir_cache, save_misc_dir_cache};
use crate::dusty::engine::dusty::misc::list_misc_files;
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;
use crate::dusty::scanners::misc::dfs_misc_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
use rusqlite::Connection;
use std::sync::{Arc, Mutex};

use crate::dusty::multithreading::DbWorker;

pub fn scan_misc_using_cache(db_worker: &DbWorker, misc_type: String, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        let type_clone = misc_type.clone();
        if let Ok(Ok(cached_files)) = db_worker.run_sync(move |conn| get_misc_cache(conn, &type_clone)) {
            if !cached_files.is_empty() {
                logger::debug!(format!("scanned {} files from cache:", misc_type).as_str(), cached_files.len());
                return cached_files;
            }
        }
    }

    let files = list_misc_files(&misc_type);

    let type_clone = misc_type.clone();
    let files_clone = files.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_misc_cache(conn, &type_clone) {
            logger::error!("RESET_MISC_CACHE_FAILED", err.log_details());
        }

        for file in &files_clone {
            if let Err(err) = add_or_update_misc_cache(conn, file, &type_clone) {
                logger::error!("ADD_MISC_CACHE_FAILED", err.log_details());
            }
        }
    });

    files
}

pub fn scan_misc_tree_using_cache(db_worker: &DbWorker, misc_type: String, use_cache: bool) -> Vec<MiscDir> {
    if use_cache {
        let type_clone = misc_type.clone();
        if let Ok(Ok(cached_dirs)) = db_worker.run_sync(move |conn| get_misc_dir_cache(conn, &type_clone)) {
            if !cached_dirs.is_empty() {
                logger::debug!(format!("scanned {} tree from cache:", misc_type).as_str(), cached_dirs.len());
                return cached_dirs;
            }
        }
    }

    let mut misc_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_misc_dir_scanner(&root, &mut misc_dirs, is_root(&root), &misc_type);
    }

    let type_clone = misc_type.clone();
    let misc_dirs_clone = misc_dirs.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_misc_dir_cache(conn, &type_clone) {
            logger::error!("RESET_MISC_DIR_CACHE_FAILED", err.log_details());
        }
        if let Err(err) = save_misc_dir_cache(conn, &misc_dirs_clone, &type_clone) {
            logger::error!("SAVE_MISC_DIR_CACHE_FAILED", err.log_details());
        }
    });

    misc_dirs
}

#[tauri::command]
pub async fn scan_misc(
    state: tauri::State<'_, AppState>,
    misc_type: String,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_misc", move || {
            scan_misc_using_cache(&db_worker, misc_type, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_misc(
    state: tauri::State<'_, AppState>,
    misc_type: String,
) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_misc", move || {
            scan_misc_using_cache(&db_worker, misc_type, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_misc_tree(
    state: tauri::State<'_, AppState>,
    misc_type: String,
) -> Result<Vec<MiscDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_misc_tree", move || {
            scan_misc_tree_using_cache(&db_worker, misc_type, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_misc_tree(
    state: tauri::State<'_, AppState>,
    misc_type: String,
) -> Result<Vec<MiscDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_misc_tree", move || {
            scan_misc_tree_using_cache(&db_worker, misc_type, false)
        })
        .await
}

#[tauri::command]
pub async fn reset_misc_cache_table(
    state: tauri::State<'_, AppState>,
    misc_type: String,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            reset_misc_cache(conn, &misc_type).map_err(|e| {
                logger::error!("RESET_MISC_CACHE_FAILED", e.log_details());
                e.to_user_message()
            })?;
            reset_misc_dir_cache(conn, &misc_type).map_err(|e| {
                logger::error!("RESET_MISC_DIR_CACHE_FAILED", e.log_details());
                e.to_user_message()
            })?;
            Ok(())
        })
        .await
        .map_err(|e| e)?
}
