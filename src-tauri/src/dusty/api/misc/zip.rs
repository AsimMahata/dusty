use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::data::zip::ZipDir;
use crate::dusty::db::misc::{add_or_update_zip_cache, get_zip_cache, reset_zip_cache};
use crate::dusty::db::misc::{get_zip_dir_cache, reset_zip_dir_cache, save_zip_dir_cache};
use crate::dusty::engine::dusty::zip::list_large_zip_files;
use crate::dusty::logger::logger;
use crate::dusty::scanners::zip::dfs_zip_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};


use crate::dusty::multithreading::DbWorker;

pub fn scan_zip_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        if let Ok(Ok(cached_files)) = db_worker.run_sync(|conn| get_zip_cache(conn)) {
            if !cached_files.is_empty() {
                logger::debug!("scanned zip files from cache:", cached_files.len());
                return cached_files;
            }
        }
    }

    let files = list_large_zip_files();
    
    let files_clone = files.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_zip_cache(conn) {
            logger::error!("RESET_ZIP_CACHE_FAILED", err.to_string());
        }
        
        for file in &files_clone {
            if let Err(err) = add_or_update_zip_cache(conn, file) {
                logger::error!("ADD_ZIP_CACHE_FAILED", err.to_string());
            }
        }
    });
    
    files
}

pub fn scan_zip_tree_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<ZipDir> {
    if use_cache {
        if let Ok(Ok(cached_dirs)) = db_worker.run_sync(|conn| get_zip_dir_cache(conn)) {
            if !cached_dirs.is_empty() {
                logger::debug!("scanned zip tree from cache:", cached_dirs.len());
                return cached_dirs;
            }
        }
    }

    let mut zip_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_zip_dir_scanner(&root, &mut zip_dirs, is_root(&root));
    }

    let zip_dirs_clone = zip_dirs.clone();
    let _ = db_worker.run_sync(move |conn| {
        reset_zip_dir_cache(conn).ok();
        save_zip_dir_cache(conn, &zip_dirs_clone).ok();
    });

    zip_dirs
}

#[tauri::command]
pub async fn scan_zip(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_zip", move || {
            scan_zip_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_zip(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_zip", move || {
            scan_zip_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_zip_tree(state: tauri::State<'_, AppState>) -> Result<Vec<ZipDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_zip_tree", move || {
            scan_zip_tree_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_zip_tree(state: tauri::State<'_, AppState>) -> Result<Vec<ZipDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_zip_tree", move || {
            scan_zip_tree_using_cache(&db_worker, false)
        })
        .await
}
