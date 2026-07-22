use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::data::zip::ZipDir;
use crate::dusty::db::zip_cache::{add_or_update_zip_cache, get_zip_cache, reset_zip_cache};
use crate::dusty::db::zip_dir_cache::{get_zip_dir_cache, reset_zip_dir_cache, save_zip_dir_cache};
use crate::dusty::engine::dusty::zip::list_large_zip_files;
use crate::dusty::logger::logger;
use crate::dusty::scanners::zip::dfs_zip_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
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

pub fn scan_zip_tree_using_cache(db: &Connection, use_cache: bool) -> Vec<ZipDir> {
    if use_cache {
        match get_zip_dir_cache(db) {
            Ok(cached_dirs) => {
                if !cached_dirs.is_empty() {
                    logger::debug!("scanned zip tree from cache:", cached_dirs.len());
                    return cached_dirs;
                }
            }
            Err(err) => {
                logger::error!("GET_ZIP_DIR_CACHE_FAILED", err);
            }
        }
    }

    let mut zip_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_zip_dir_scanner(&root, &mut zip_dirs, is_root(&root));
    }

    reset_zip_dir_cache(db).ok();
    save_zip_dir_cache(db, &zip_dirs).ok();

    zip_dirs
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

#[tauri::command]
pub fn scan_zip_tree(state: tauri::State<AppState>) -> Vec<ZipDir> {
    let db = state.db.lock().unwrap();
    scan_zip_tree_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_zip_tree(state: tauri::State<AppState>) -> Vec<ZipDir> {
    let db = state.db.lock().unwrap();
    scan_zip_tree_using_cache(&db, false)
}
