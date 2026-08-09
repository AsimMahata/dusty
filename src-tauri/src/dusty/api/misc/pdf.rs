use crate::dusty::data::file::FileInfo;
use crate::dusty::data::pdf::PdfDir;
use crate::dusty::data::state::AppState;
use crate::dusty::db::misc::{add_or_update_pdf_cache, get_pdf_cache, reset_pdf_cache};
use crate::dusty::db::misc::{get_pdf_dir_cache, reset_pdf_dir_cache, save_pdf_dir_cache};
use crate::dusty::engine::dusty::pdf::list_pdfs;
use crate::dusty::logger::logger;
use crate::dusty::scanners::pdf::dfs_pdf_dir_scanner;
use crate::dusty::utility::info::{get_all_valid_source_path, is_root};


use crate::dusty::multithreading::DbWorker;

pub fn scan_pdf_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<FileInfo> {
    if use_cache {
        if let Ok(Ok(cached_files)) = db_worker.run_sync(|conn| get_pdf_cache(conn)) {
            if !cached_files.is_empty() {
                logger::debug!("scanned pdf files from cache:", cached_files.len());
                return cached_files;
            }
        }
    }

    let files = list_pdfs();
    
    let files_clone = files.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = reset_pdf_cache(conn) {
            logger::error!("RESET_PDF_CACHE_FAILED", err.to_string());
        }
        
        for file in &files_clone {
            if let Err(err) = add_or_update_pdf_cache(conn, file) {
                logger::error!("ADD_PDF_CACHE_FAILED", err.to_string());
            }
        }
    });
    
    files
}

pub fn scan_pdf_tree_using_cache(db_worker: &DbWorker, use_cache: bool) -> Vec<PdfDir> {
    if use_cache {
        if let Ok(Ok(cached_dirs)) = db_worker.run_sync(|conn| get_pdf_dir_cache(conn)) {
            if !cached_dirs.is_empty() {
                logger::debug!("scanned pdf tree from cache:", cached_dirs.len());
                return cached_dirs;
            }
        }
    }

    let mut pdf_dirs = Vec::new();
    for root in get_all_valid_source_path() {
        dfs_pdf_dir_scanner(&root, &mut pdf_dirs, is_root(&root));
    }

    let pdf_dirs_clone = pdf_dirs.clone();
    let _ = db_worker.run_sync(move |conn| {
        reset_pdf_dir_cache(conn).ok();
        save_pdf_dir_cache(conn, &pdf_dirs_clone).ok();
    });

    pdf_dirs
}

#[tauri::command]
pub async fn scan_pdf(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_pdf", move || {
            scan_pdf_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_pdf(state: tauri::State<'_, AppState>) -> Result<Vec<FileInfo>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_pdf", move || {
            scan_pdf_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_pdf_tree(state: tauri::State<'_, AppState>) -> Result<Vec<PdfDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_pdf_tree", move || {
            scan_pdf_tree_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_pdf_tree(state: tauri::State<'_, AppState>) -> Result<Vec<PdfDir>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_pdf_tree", move || {
            scan_pdf_tree_using_cache(&db_worker, false)
        })
        .await
}
