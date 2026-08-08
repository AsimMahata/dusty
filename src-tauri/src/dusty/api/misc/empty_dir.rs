use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::misc::{add_or_update_empty_dir_cache, get_empty_dir_cache, reset_empty_dir_cache};
use crate::dusty::engine::dusty::empty_dir::list_empty_dirs;
use crate::dusty::error::DustyError;
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
                logger::error!("GET_EMPTY_DIR_CACHE_FAILED", err.log_details());
            }
        }
    }

    let files = list_empty_dirs();
    
    if let Err(err) = reset_empty_dir_cache(db) {
        logger::error!("RESET_EMPTY_DIR_CACHE_FAILED", err.log_details());
    }
    
    for file in &files {
        if let Err(err) = add_or_update_empty_dir_cache(db, file) {
            logger::error!("ADD_EMPTY_DIR_CACHE_FAILED", err.log_details());
        }
    }
    
    files
}

#[tauri::command]
pub fn scan_empty_dir(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("scan_empty_dir");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_empty_dir_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_empty_dir(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("sync_scan_empty_dir");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_empty_dir_using_cache(&db, false)
}
