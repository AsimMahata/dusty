use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::empty_dir_cache::{add_or_update_empty_dir_cache, get_empty_dir_cache, reset_empty_dir_cache};
use crate::dusty::engine::dusty::empty_dir::list_empty_dirs;
use crate::dusty::logger::logger;
use rusqlite::Connection;

pub fn scan_empty_dir_using_cache(db: &Connection, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        match get_empty_dir_cache(db) {
            Ok(cached_files) => {
                if !cached_files.is_empty() {
                    logger::debug!("scanned empty dirs from cache:", cached_files.len());
                    return cached_files;
                }
            }
            Err(err) => {
                logger::error!("GET_EMPTY_DIR_CACHE_FAILED", err);
            }
        }
    }

    let files = list_empty_dirs();
    
    if let Err(err) = reset_empty_dir_cache(db) {
        logger::error!("RESET_EMPTY_DIR_CACHE_FAILED", err);
    }
    
    for file in &files {
        if let Err(err) = add_or_update_empty_dir_cache(db, file) {
            logger::error!("ADD_EMPTY_DIR_CACHE_FAILED", err);
        }
    }
    
    files
}

#[tauri::command]
pub fn scan_empty_dir(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_empty_dir_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_empty_dir(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_empty_dir_using_cache(&db, false)
}
