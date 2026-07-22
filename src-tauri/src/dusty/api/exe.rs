use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::exe_cache::{add_or_update_exe_cache, get_exe_cache, reset_exe_cache};
use crate::dusty::engine::dusty::exe::list_executables;
use crate::dusty::logger::logger;
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
pub fn reset_exe_cache_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    reset_exe_cache(&db).map_err(|e| e.to_string())?;
    Ok(())
}
