use std::path::PathBuf;

use crate::dusty::db::show::add_scan_to_cache;
use crate::dusty::db::show::add_shows_in_db;
use crate::dusty::db::show::get_from_show_cache_in_db;
use crate::dusty::db::show::get_scan_from_cache;
use crate::dusty::db::show::get_show_info;
use crate::dusty::db::show::rename_show_in_db;
use crate::dusty::db::show::reset_show_cache_table_in_db;
use crate::dusty::db::show::reset_show_table_in_db;
use crate::dusty::db::show::update_ban_status_in_db;
use crate::dusty::db::show::update_pin_status_in_db;
use crate::dusty::db::show::update_show_provider_in_db;
use crate::dusty::db::show::update_show_status_in_db;
use crate::dusty::db::show::upsert_show_cache_in_db;
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;
use crate::dusty::models::shows::ShowResult;
use crate::dusty::models::state::AppState;
use crate::dusty::scanners::show_scanner::get_all_linked_shows;
use crate::dusty::scanners::show_scanner::scan_for_shows_using_available_show_titles;
use crate::dusty::utility::info::get_all_valid_source_path;
use crate::dusty::utility::sha256_hash::get_sha256_id;

use crate::dusty::multithreading::DbWorker;

pub fn scan_show_using_cached(
    db_worker: &DbWorker,
    path: Option<String>,
    cache: bool,
) -> Vec<ShowResult> {
    let scan_root_path = match &path {
        Some(p) if !p.trim().is_empty() => PathBuf::from(p),
        _ => PathBuf::from("all_valid_sources"),
    };

    if cache {
        let scan_root_clone = scan_root_path.clone();
        if let Ok(Ok(Some(cached_shows))) = db_worker.run_sync(move |conn| {
            if let Ok(Some(shows)) = get_scan_from_cache(conn, &scan_root_clone) {
                let enriched: Vec<ShowResult> = shows
                    .into_iter()
                    .map(|mut show| {
                        if let Ok(info) = get_show_info(conn, &show.id) {
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
                return Ok::<Option<Vec<ShowResult>>, DustyError>(Some(enriched));
            }
            Ok::<Option<Vec<ShowResult>>, DustyError>(None)
        }) {
            return cached_shows;
        }
    }

    let roots: Vec<PathBuf> = match &path {
        Some(p) if !p.trim().is_empty() => vec![PathBuf::from(p)],
        _ => get_all_valid_source_path(),
    };

    let titles = db_worker
        .run_sync(|conn| get_all_linked_shows(conn).unwrap_or_default())
        .unwrap_or_default();

    let mut all_shows: Vec<ShowResult> = Vec::new();
    for root in roots {
        let shows = scan_for_shows_using_available_show_titles(&titles, &root);

        let shows_clone = shows.clone();
        let root_clone = root.clone();
        let _ = db_worker.run_sync(move |conn| {
            if let Err(err) = add_scan_to_cache(conn, &root_clone, &shows_clone) {
                logger::warning!("ADD_SCAN_TO_CACHE_FAILED", err.log_details());
            }
        });
        all_shows.extend(shows);
    }

    let all_shows_clone = all_shows.clone();
    let scan_root_clone = scan_root_path.clone();
    let _ = db_worker.run_sync(move |conn| {
        if let Err(err) = add_shows_in_db(conn, &all_shows_clone) {
            logger::error!("ADD_SHOWS_IN_DB_FAILED", err.log_details());
        }
        if let Err(err) = add_scan_to_cache(conn, &scan_root_clone, &all_shows_clone) {
            logger::warning!("ADD_SCAN_TO_CACHE_FAILED", err.log_details());
        }
    });

    all_shows
}

#[tauri::command]
pub async fn scan_shows(
    state: tauri::State<'_, AppState>,
    path: Option<String>,
) -> Result<Vec<ShowResult>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_shows", move || {
            scan_show_using_cached(&db_worker, path, true)
        })
        .await
}

#[tauri::command]
pub async fn sync_scan_shows(
    state: tauri::State<'_, AppState>,
    path: Option<String>,
) -> Result<Vec<ShowResult>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_shows", move || {
            scan_show_using_cached(&db_worker, path, false)
        })
        .await
}

#[tauri::command]
pub async fn rename_show(
    state: tauri::State<'_, AppState>,
    show_id: String,
    new_name: String,
) -> Result<bool, String> {
    state
        .db_worker
        .run(move |conn| {
            if let Err(err) = rename_show_in_db(conn, show_id.clone(), new_name.clone()) {
                logger::error!("RENAME_SHOW_FAILED", err.log_details());
                false
            } else {
                logger::info!("RENAME_SHOW_SUCCESS", show_id, new_name);
                true
            }
        })
        .await
}

#[tauri::command]
pub async fn update_show_status(
    state: tauri::State<'_, AppState>,
    show_id: String,
    new_status: String,
) -> Result<bool, String> {
    state
        .db_worker
        .run(move |conn| {
            if let Err(err) = update_show_status_in_db(conn, show_id.clone(), new_status.clone()) {
                logger::error!("UPDATE_SHOW_STATUS_FAILED", err.log_details());
                false
            } else {
                logger::info!("UPDATE_SHOW_STATUS_SUCCESS", show_id, new_status);
                true
            }
        })
        .await
}

#[tauri::command]
pub async fn update_ban_status(
    state: tauri::State<'_, AppState>,
    show_id: String,
    new_ban_status: bool,
) -> Result<bool, String> {
    state
        .db_worker
        .run(move |conn| {
            if let Err(err) = update_ban_status_in_db(conn, show_id.clone(), new_ban_status) {
                logger::error!("UPDATE_BAN_STATUS_FAILED", err.log_details());
                false
            } else {
                logger::info!("UPDATE_BAN_STATUS_SUCCESS", show_id, new_ban_status);
                true
            }
        })
        .await
}

#[tauri::command]
pub async fn update_pin_status(
    state: tauri::State<'_, AppState>,
    show_id: String,
    new_pin_status: bool,
) -> Result<bool, String> {
    state
        .db_worker
        .run(move |conn| {
            if let Err(err) = update_pin_status_in_db(conn, show_id.clone(), new_pin_status) {
                logger::error!("UPDATE_PIN_STATUS_FAILED", err.log_details());
                false
            } else {
                logger::info!("UPDATE_PIN_STATUS_SUCCESS", show_id, new_pin_status);
                true
            }
        })
        .await
}

#[tauri::command]
pub async fn reset_shows_table(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_show_table_in_db(conn).map_err(|err| {
                logger::error!("RESET_SHOWS_TABLE_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn update_show_id(
    state: tauri::State<'_, AppState>,
    id: String,
    provider: String,
    provider_id: String,
    show_type: Option<String>,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            update_show_provider_in_db(conn, id, provider, provider_id, show_type).map_err(|err| {
                logger::error!("UPDATE_SHOW_ID_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn get_show_cache(
    state: tauri::State<'_, AppState>,
    show_id: String,
    provider: String,
) -> Result<Option<String>, String> {
    state
        .db_worker
        .run(move |conn| {
            get_from_show_cache_in_db(conn, show_id, provider).map_err(|err| {
                logger::error!("GET_SHOW_CACHE_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn upsert_show_cache(
    state: tauri::State<'_, AppState>,
    show_id: String,
    provider: String,
    payload: String,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            upsert_show_cache_in_db(conn, show_id, provider, payload).map_err(|err| {
                logger::error!("UPSERT_SHOW_CACHE_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn reset_show_cache(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_show_cache_table_in_db(conn).map_err(|err| {
                logger::error!("RESET_SHOW_CACHE_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn add_shows_to_db(
    state: tauri::State<'_, AppState>,
    shows: Vec<ShowResult>,
) -> Result<bool, String> {
    state
        .db_worker
        .run(move |conn| {
            if let Err(e) = add_shows_in_db(conn, &shows) {
                logger::error!("FAILED_TO_ADD_SHOWS_TO_DB", e.log_details());
                false
            } else {
                true
            }
        })
        .await
}

#[tauri::command]
pub fn get_show_cache_key(title: String) -> String {
    get_sha256_id("SHOW".to_string(), title)
}
