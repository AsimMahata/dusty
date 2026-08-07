use rusqlite::Connection;
use std::path::PathBuf;

use crate::dusty::data::{shows::ShowResult, state::AppState};
use crate::dusty::utility::sha256_hash::get_sha256_id;
use crate::dusty::db::show::{
    add_scan_to_cache, add_show_in_db, add_shows_in_db, get_from_show_cache_in_db,
    get_scan_from_cache, get_show_info, rename_show_in_db, reset_show_cache_table_in_db,
    reset_show_table_in_db, update_ban_status_in_db, update_pin_status_in_db,
    update_show_provider_in_db, update_show_status_in_db, upsert_show_cache_in_db,
};
use crate::dusty::logger::logger;
use crate::dusty::scanners::show_scanner::scan_for_shows_using_available_show_titles;

pub fn scan_show_using_cached(db: &Connection, root: &PathBuf, cache: bool) -> Vec<ShowResult> {
    let scan_root_str = root.to_string_lossy().into_owned();
    if cache {
        if let Ok(Some(shows)) = get_scan_from_cache(db, &scan_root_str) {
            return shows
                .into_iter()
                .map(|mut show| {
                    if let Ok(info) = get_show_info(&db, &show.id) {
                        show.title = info.title;
                        show.status = info.status;
                        show.banned = info.banned;
                        show.pinned = info.pinned;
                        show.provider = info.provider;
                        show.provider_id = info.provider_id;
                        show.airing = info.airing;
                        show.show_type = info.show_type;
                    }
                    show
                })
                .collect();
        }
    }
    let shows = scan_for_shows_using_available_show_titles(db, root);
    let _ = add_shows_in_db(db, &shows);
    let _ = add_scan_to_cache(db, &scan_root_str, &shows);
    shows
}

#[tauri::command]
pub fn scan_shows(state: tauri::State<AppState>, path: String) -> Vec<ShowResult> {
    let db = state.db.lock().unwrap();
    let root = PathBuf::from(&path);
    scan_show_using_cached(&db, &root, true)
}

#[tauri::command]
pub fn sync_scan_shows(state: tauri::State<AppState>, path: String) -> Vec<ShowResult> {
    let db = state.db.lock().unwrap();
    let root = PathBuf::from(&path);
    scan_show_using_cached(&db, &root, false)
}

#[tauri::command]
pub fn rename_show(state: tauri::State<AppState>, show_id: String, new_name: String) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = rename_show_in_db(&db, show_id.clone(), new_name.clone()) {
        logger::error!("RENAME_SHOW_FAILED", err);
        return false;
    }
    logger::info!("RENAME_SHOW_SUCCESS", show_id, new_name);
    true
}

#[tauri::command]
pub fn update_show_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_status: String,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_show_status_in_db(&db, show_id.clone(), new_status.clone()) {
        logger::error!("UPDATE_SHOW_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_SHOW_STATUS_SUCCESS", show_id, new_status);
    true
}

#[tauri::command]
pub fn update_ban_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_ban_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_ban_status_in_db(&db, show_id.clone(), new_ban_status) {
        logger::error!("UPDATE_BAN_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_BAN_STATUS_SUCCESS", show_id, new_ban_status);
    true
}

#[tauri::command]
pub fn update_pin_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_pin_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_pin_status_in_db(&db, show_id.clone(), new_pin_status) {
        logger::error!("UPDATE_PIN_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_PIN_STATUS_SUCCESS", show_id, new_pin_status);
    true
}

#[tauri::command]
pub fn reset_shows_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    reset_show_table_in_db(&db)
        .map_err(|e| format!("Failed to reset shows table: {}", e))
        .ok();
    Ok(())
}

#[tauri::command]
pub fn update_show_id(
    state: tauri::State<AppState>,
    id: String,
    provider: String,
    provider_id: String,
    show_type: Option<String>,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    update_show_provider_in_db(&db, id, provider, provider_id, show_type)
        .map_err(|e| format!("Failed to update show provider in db: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn get_show_cache(
    state: tauri::State<AppState>,
    show_id: String,
    provider: String,
) -> Result<Option<String>, String> {
    let db = state.db.lock().unwrap();
    get_from_show_cache_in_db(&db, show_id, provider)
}

#[tauri::command]
pub fn upsert_show_cache(
    state: tauri::State<AppState>,
    show_id: String,
    provider: String,
    payload: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    upsert_show_cache_in_db(&db, show_id, provider, payload)
}

#[tauri::command]
pub fn reset_show_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    reset_show_cache_table_in_db(&db)
}

#[tauri::command]
pub fn add_shows_to_db(state: tauri::State<AppState>, shows: Vec<ShowResult>) -> bool {
    let db = state.db.lock().unwrap();
    let mut success = true;
    for show in shows {
        if let Err(e) = add_show_in_db(&db, &show) {
            logger::error!("FAILED_TO_ADD_SHOW_TO_DB", e);
            success = false;
        }
    }
    success
}

#[tauri::command]
pub fn get_show_cache_key(title: String) -> String {
    get_sha256_id("SHOW".to_string(), title)
}
