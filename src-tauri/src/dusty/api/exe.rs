use crate::dusty::data::exe::ExecutableDir;
use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::exe_cache::{add_or_update_exe_cache, get_exe_cache, reset_exe_cache};
use crate::dusty::db::exe_dir_cache::{get_exe_dir_cache, reset_exe_dir_cache, save_exe_dir_cache};
use crate::dusty::engine::dusty::exe::list_executables;
use crate::dusty::logger::logger;
use crate::dusty::scanners::exe::dfs_exe_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
use rusqlite::Connection;

pub fn scan_exe_using_cache(db: &Connection, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        match get_exe_cache(db) {
            Ok(cached_files) => {
                if !cached_files.is_empty() {
                    logger::debug!("scanned exe files from cache:", cached_files.len());
                    return cached_files;
                }
            }
            Err(err) => {
                logger::error!("GET_EXE_CACHE_FAILED", err);
            }
        }
    }

    let files = list_executables();

    if let Err(err) = reset_exe_cache(db) {
        logger::error!("RESET_EXE_CACHE_FAILED", err);
    }

    for file in &files {
        if let Err(err) = add_or_update_exe_cache(db, file) {
            logger::error!("ADD_EXE_CACHE_FAILED", err);
        }
    }

    files
}

pub fn scan_exe_tree_using_cache(db: &Connection, use_cache: bool) -> Vec<ExecutableDir> {
    if use_cache {
        match get_exe_dir_cache(db) {
            Ok(cached_dirs) => {
                if !cached_dirs.is_empty() {
                    logger::debug!("scanned exe tree from cache:", cached_dirs.len());
                    return cached_dirs;
                }
            }
            Err(err) => {
                logger::error!("GET_EXE_DIR_CACHE_FAILED", err);
            }
        }
    }

    let mut exe_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_exe_dir_scanner(&root, &mut exe_dirs, is_root(&root));
    }

    reset_exe_dir_cache(db).ok();
    save_exe_dir_cache(db, &exe_dirs).ok();

    exe_dirs
}

#[tauri::command]
pub fn scan_exe(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_exe_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_exe(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_exe_using_cache(&db, false)
}

#[tauri::command]
pub fn scan_exe_tree(state: tauri::State<AppState>) -> Vec<ExecutableDir> {
    let db = state.db.lock().unwrap();
    scan_exe_tree_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_exe_tree(state: tauri::State<AppState>) -> Vec<ExecutableDir> {
    let db = state.db.lock().unwrap();
    scan_exe_tree_using_cache(&db, false)
}

#[tauri::command]
pub fn reset_exe_cache_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    reset_exe_cache(&db).map_err(|e| e.to_string())?;
    reset_exe_dir_cache(&db).map_err(|e| e.to_string())?;
    Ok(())
}
