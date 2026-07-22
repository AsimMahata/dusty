use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::zip_cache::{add_or_update_zip_cache, get_zip_cache, reset_zip_cache};
use crate::dusty::engine::dusty::zip::list_large_zip_files;
use crate::dusty::logger::logger;
use rusqlite::Connection;

pub fn scan_zip_using_cache(db: &Connection, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        match get_zip_cache(db) {
            Ok(cached_files) => {
                if !cached_files.is_empty() {
                    logger::debug!("scanned zip files from cache:", cached_files.len());
                    return cached_files;
                }
            }
            Err(err) => {
                logger::error!("GET_ZIP_CACHE_FAILED", err);
            }
        }
    }

    let files = list_large_zip_files();
    
    if let Err(err) = reset_zip_cache(db) {
        logger::error!("RESET_ZIP_CACHE_FAILED", err);
    }
    
    for file in &files {
        if let Err(err) = add_or_update_zip_cache(db, file) {
            logger::error!("ADD_ZIP_CACHE_FAILED", err);
        }
    }
    
    files
}

#[tauri::command]
pub fn scan_zip(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_zip_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_zip(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_zip_using_cache(&db, false)
}
