use crate::dusty::data::misc_dir::MiscDir;
use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::db::misc_cache::{add_or_update_misc_cache, get_misc_cache, reset_misc_cache};
use crate::dusty::db::misc_dir_cache::{get_misc_dir_cache, reset_misc_dir_cache, save_misc_dir_cache};
use crate::dusty::engine::dusty::misc::list_misc_files;
use crate::dusty::logger::logger;
use crate::dusty::scanners::misc::dfs_misc_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
use rusqlite::Connection;

pub fn scan_misc_using_cache(db: &Connection, misc_type: String, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        match get_misc_cache(db, &misc_type) {
            Ok(cached_files) => {
                if !cached_files.is_empty() {
                    logger::debug!(format!("scanned {} files from cache:", misc_type).as_str(), cached_files.len());
                    return cached_files;
                }
            }
            Err(err) => {
                logger::error!("GET_MISC_CACHE_FAILED", err);
            }
        }
    }

    let files = list_misc_files(&misc_type);

    if let Err(err) = reset_misc_cache(db, &misc_type) {
        logger::error!("RESET_MISC_CACHE_FAILED", err);
    }

    for file in &files {
        if let Err(err) = add_or_update_misc_cache(db, file, &misc_type) {
            logger::error!("ADD_MISC_CACHE_FAILED", err);
        }
    }

    files
}

pub fn scan_misc_tree_using_cache(db: &Connection, misc_type: String, use_cache: bool) -> Vec<MiscDir> {
    if use_cache {
        match get_misc_dir_cache(db, &misc_type) {
            Ok(cached_dirs) => {
                if !cached_dirs.is_empty() {
                    logger::debug!(format!("scanned {} tree from cache:", misc_type).as_str(), cached_dirs.len());
                    return cached_dirs;
                }
            }
            Err(err) => {
                logger::error!("GET_MISC_DIR_CACHE_FAILED", err);
            }
        }
    }

    let mut misc_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_misc_dir_scanner(&root, &mut misc_dirs, is_root(&root), &misc_type);
    }

    reset_misc_dir_cache(db, &misc_type).ok();
    save_misc_dir_cache(db, &misc_dirs, &misc_type).ok();

    misc_dirs
}

#[tauri::command]
pub fn scan_misc(state: tauri::State<AppState>, misc_type: String) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_misc_using_cache(&db, misc_type, true)
}

#[tauri::command]
pub fn sync_scan_misc(state: tauri::State<AppState>, misc_type: String) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_misc_using_cache(&db, misc_type, false)
}

#[tauri::command]
pub fn scan_misc_tree(state: tauri::State<AppState>, misc_type: String) -> Vec<MiscDir> {
    let db = state.db.lock().unwrap();
    scan_misc_tree_using_cache(&db, misc_type, true)
}

#[tauri::command]
pub fn sync_scan_misc_tree(state: tauri::State<AppState>, misc_type: String) -> Vec<MiscDir> {
    let db = state.db.lock().unwrap();
    scan_misc_tree_using_cache(&db, misc_type, false)
}

#[tauri::command]
pub fn reset_misc_cache_table(state: tauri::State<AppState>, misc_type: String) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    reset_misc_cache(&db, &misc_type).map_err(|e| e.to_string())?;
    reset_misc_dir_cache(&db, &misc_type).map_err(|e| e.to_string())?;
    Ok(())
}
