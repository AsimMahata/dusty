use crate::dusty::data::file::FileInfo;
use crate::dusty::data::pdf::PdfDir;
use crate::dusty::data::state::AppState;
use crate::dusty::db::pdf_cache::{add_or_update_pdf_cache, get_pdf_cache, reset_pdf_cache};
use crate::dusty::db::pdf_dir_cache::{get_pdf_dir_cache, reset_pdf_dir_cache, save_pdf_dir_cache};
use crate::dusty::engine::dusty::pdf::list_pdfs;
use crate::dusty::logger::logger;
use crate::dusty::scanners::pdf::dfs_pdf_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};
use rusqlite::Connection;

pub fn scan_pdf_using_cache(db: &Connection, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        match get_pdf_cache(db) {
            Ok(cached_files) => {
                if !cached_files.is_empty() {
                    logger::debug!("scanned pdf files from cache:", cached_files.len());
                    return cached_files;
                }
            }
            Err(err) => {
                logger::error!("GET_PDF_CACHE_FAILED", err);
            }
        }
    }

    let files = list_pdfs();
    
    if let Err(err) = reset_pdf_cache(db) {
        logger::error!("RESET_PDF_CACHE_FAILED", err);
    }
    
    for file in &files {
        if let Err(err) = add_or_update_pdf_cache(db, file) {
            logger::error!("ADD_PDF_CACHE_FAILED", err);
        }
    }
    
    files
}

pub fn scan_pdf_tree_using_cache(db: &Connection, use_cache: bool) -> Vec<PdfDir> {
    if use_cache {
        match get_pdf_dir_cache(db) {
            Ok(cached_dirs) => {
                if !cached_dirs.is_empty() {
                    logger::debug!("scanned pdf tree from cache:", cached_dirs.len());
                    return cached_dirs;
                }
            }
            Err(err) => {
                logger::error!("GET_PDF_DIR_CACHE_FAILED", err);
            }
        }
    }

    let mut pdf_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_pdf_dir_scanner(&root, &mut pdf_dirs, is_root(&root));
    }

    reset_pdf_dir_cache(db).ok();
    save_pdf_dir_cache(db, &pdf_dirs).ok();

    pdf_dirs
}

#[tauri::command]
pub fn scan_pdf(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_pdf_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_pdf(state: tauri::State<AppState>) -> Vec<FileInfo> {
    let db = state.db.lock().unwrap();
    scan_pdf_using_cache(&db, false)
}

#[tauri::command]
pub fn scan_pdf_tree(state: tauri::State<AppState>) -> Vec<PdfDir> {
    let db = state.db.lock().unwrap();
    scan_pdf_tree_using_cache(&db, true)
}

#[tauri::command]
pub fn sync_scan_pdf_tree(state: tauri::State<AppState>) -> Vec<PdfDir> {
    let db = state.db.lock().unwrap();
    scan_pdf_tree_using_cache(&db, false)
}
