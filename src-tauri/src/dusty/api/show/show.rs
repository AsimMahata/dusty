use rusqlite::Connection;
use std::path::PathBuf;

use crate::dusty::data::{shows::ShowResult, state::AppState};
use crate::dusty::error::DustyError;
use crate::dusty::utility::sha256_hash::get_sha256_id;
use crate::dusty::db::show::{
    add_scan_to_cache, add_show_in_db, add_shows_in_db, get_from_show_cache_in_db,
    get_scan_from_cache, get_show_info, rename_show_in_db, reset_show_cache_table_in_db,
    reset_show_table_in_db, update_ban_status_in_db, update_pin_status_in_db,
    update_show_provider_in_db, update_show_status_in_db, upsert_show_cache_in_db,
};
use crate::dusty::logger::logger;
use crate::dusty::scanners::show_scanner::scan_for_shows_using_available_show_titles;
use crate::dusty::utility::info::get_all_valid_source_path;

pub fn scan_show_using_cached(
    db: &Connection,
    path: Option<String>,
    cache: bool,
) -> Vec<ShowResult> {
    let scan_root_path = match &path {
        Some(p) if !p.trim().is_empty() => PathBuf::from(p),
        _ => PathBuf::from("all_valid_sources"),
    };

    if cache {
        if let Ok(Some(shows)) = get_scan_from_cache(db, &scan_root_path) {
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

    let roots: Vec<PathBuf> = match &path {
        Some(p) if !p.trim().is_empty() => vec![PathBuf::from(p)],
        _ => get_all_valid_source_path(),
    };

    let mut all_shows: Vec<ShowResult> = Vec::new();
    for root in roots {
        let shows = scan_for_shows_using_available_show_titles(db, &root);
        if let Err(err) = add_scan_to_cache(db, &root, &shows) {
            logger::warning!("ADD_SCAN_TO_CACHE_FAILED", err.log_details());
        }
        all_shows.extend(shows);
    }

    if let Err(err) = add_shows_in_db(db, &all_shows) {
        logger::error!("ADD_SHOWS_IN_DB_FAILED", err.log_details());
    }
    if let Err(err) = add_scan_to_cache(db, &scan_root_path, &all_shows) {
        logger::warning!("ADD_SCAN_TO_CACHE_FAILED", err.log_details());
    }
    all_shows
}

#[tauri::command]
pub fn scan_shows(state: tauri::State<AppState>, path: Option<String>) -> Vec<ShowResult> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_scan_shows");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_show_using_cached(&db, path, true)
}

#[tauri::command]
pub fn sync_scan_shows(state: tauri::State<AppState>, path: Option<String>) -> Vec<ShowResult> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_sync_scan_shows");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_show_using_cached(&db, path, false)
}

#[tauri::command]
pub fn rename_show(state: tauri::State<AppState>, show_id: String, new_name: String) -> bool {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_rename_show");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return false;
        }
    };
    if let Err(err) = rename_show_in_db(&db, show_id.clone(), new_name.clone()) {
        logger::error!("RENAME_SHOW_FAILED", err.log_details());
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
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_update_show_status");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return false;
        }
    };
    if let Err(err) = update_show_status_in_db(&db, show_id.clone(), new_status.clone()) {
        logger::error!("UPDATE_SHOW_STATUS_FAILED", err.log_details());
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
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_update_ban_status");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return false;
        }
    };
    if let Err(err) = update_ban_status_in_db(&db, show_id.clone(), new_ban_status) {
        logger::error!("UPDATE_BAN_STATUS_FAILED", err.log_details());
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
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("lock_db_for_update_pin_status");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return false;
        }
    };
    if let Err(err) = update_pin_status_in_db(&db, show_id.clone(), new_pin_status) {
        logger::error!("UPDATE_PIN_STATUS_FAILED", err.log_details());
        return false;
    }
    logger::info!("UPDATE_PIN_STATUS_SUCCESS", show_id, new_pin_status);
    true
}

#[tauri::command]
pub fn reset_shows_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_shows_table");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    reset_show_table_in_db(&db).map_err(|err| {
        logger::error!("RESET_SHOWS_TABLE_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn update_show_id(
    state: tauri::State<AppState>,
    id: String,
    provider: String,
    provider_id: String,
    show_type: Option<String>,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("update_show_id");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    update_show_provider_in_db(&db, id, provider, provider_id, show_type).map_err(|err| {
        logger::error!("UPDATE_SHOW_ID_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn get_show_cache(
    state: tauri::State<AppState>,
    show_id: String,
    provider: String,
) -> Result<Option<String>, String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("get_show_cache");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    get_from_show_cache_in_db(&db, show_id, provider).map_err(|err| {
        logger::error!("GET_SHOW_CACHE_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn upsert_show_cache(
    state: tauri::State<AppState>,
    show_id: String,
    provider: String,
    payload: String,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("upsert_show_cache");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    upsert_show_cache_in_db(&db, show_id, provider, payload).map_err(|err| {
        logger::error!("UPSERT_SHOW_CACHE_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn reset_show_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_show_cache");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    reset_show_cache_table_in_db(&db).map_err(|err| {
        logger::error!("RESET_SHOW_CACHE_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn add_shows_to_db(state: tauri::State<AppState>, shows: Vec<ShowResult>) -> bool {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("add_shows_to_db");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return false;
        }
    };
    if let Err(e) = add_shows_in_db(&db, &shows) {
        logger::error!("FAILED_TO_ADD_SHOWS_TO_DB", e.log_details());
        return false;
    }
    true
}

#[tauri::command]
pub fn get_show_cache_key(title: String) -> String {
    get_sha256_id("SHOW".to_string(), title)
}
