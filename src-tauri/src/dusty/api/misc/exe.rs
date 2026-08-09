use crate::dusty::data::exe::ExecutableDir;
use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::misc::{add_or_update_exe_cache, get_exe_cache, reset_exe_cache};
use crate::dusty::db::misc::{get_exe_dir_cache, reset_exe_dir_cache, save_exe_dir_cache};
use crate::dusty::engine::dusty::exe::list_executables;
use crate::dusty::logger::logger;
use crate::dusty::scanners::exe::dfs_exe_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
use rusqlite::Connection;

use crate::dusty::multithreading::DbWorker;

pub fn scan_exe_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        if let Ok(Ok(cached_files)) = db_worker.run_sync(|conn| get_exe_cache(conn)) {
            if !cached_files.is_empty() {
                logger::debug!("scanned exe files from cache:", cached_files.len());
                return cached_files;
            }
        }
    }

    let files = list_executables();

    let files_clone = files.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_exe_cache(conn) {
            logger::error!("RESET_EXE_CACHE_FAILED", err.to_string());
        }

        for file in &files_clone {
            if let Err(err) = add_or_update_exe_cache(conn, file) {
                logger::error!("ADD_EXE_CACHE_FAILED", err.to_string());
            }
        }
    });

    files
}

pub fn scan_exe_tree_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<ExecutableDir> {
    if use_cache {
        if let Ok(Ok(cached_dirs)) = db_worker.run_sync(|conn| get_exe_dir_cache(conn)) {
            if !cached_dirs.is_empty() {
                logger::debug!("scanned exe tree from cache:", cached_dirs.len());
                return cached_dirs;
            }
        }
    }

    let mut exe_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_exe_dir_scanner(&root, &mut exe_dirs, is_root(&root));
    }

    let exe_dirs_clone = exe_dirs.clone();
    let _ = db_worker.run_sync(move |conn| {
        reset_exe_dir_cache(conn).ok();
        save_exe_dir_cache(conn, &exe_dirs_clone).ok();
    });

    exe_dirs
}

#[tauri::command]
pub async fn scan_exe(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_exe", move || {
            scan_exe_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_exe(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_exe", move || {
            scan_exe_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_exe_tree(state: tauri::State<'_, AppState>) -> Result<Vec<ExecutableDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_exe_tree", move || {
            scan_exe_tree_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_exe_tree(state: tauri::State<'_, AppState>) -> Result<Vec<ExecutableDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_exe_tree", move || {
            scan_exe_tree_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn reset_exe_cache_table(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_exe_cache(conn).map_err(|e| e.to_string())?;
            reset_exe_dir_cache(conn).map_err(|e| e.to_string())?;
            Ok(())
        })
        .await
        .map_err(|e| e)?
}
