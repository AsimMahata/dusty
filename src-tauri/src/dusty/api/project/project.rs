use rusqlite::Connection;
use crate::dusty::data::project::{Project, Tag};
use crate::dusty::data::state::AppState;
use crate::dusty::db::project::{
    add_projects_in_db, clear_project_cache, get_project_cache_from_db, get_project_info_from_db,
    reset_project_table_in_db, update_project_pin_status_in_db, update_project_status_in_db,
    update_project_tags_in_db,
};
use crate::dusty::engine::project::scanner::scan_all_projects;
use crate::dusty::engine::project::tag_scanner::scan_tags;
use crate::dusty::logger::logger;

pub fn sanitize_projects(db: &Connection, projects: Vec<Project>) -> Vec<Project> {
    projects
        .into_iter()
        .map(|mut p| {
            if let Ok(info) = get_project_info_from_db(&db, &p.id) {
                p.project_type = info.project_type;
                p.pinned = info.pinned;
                p.status = info.status;
                p.tags = info.tags;
                p.project_type = Some(p.get_framework());
            }
            p
        })
        .collect()
}

use crate::dusty::multithreading::DbWorker;

pub fn scan_projects_using_cache(db_worker: &DbWorker, cache: bool) -> Vec<Project> {
    if cache {
        if let Ok(Ok(cached_projects)) = db_worker.run_sync(|conn| get_project_cache_from_db(conn)) {
            logger::info!("PROJECT_CACHE_LOADED", cached_projects.len());
            if !cached_projects.is_empty() {
                logger::info!("PROJECT_CACHE_NOT_EMPTY", cached_projects.len());
                if let Ok(sanitized) = db_worker.run_sync(|conn| sanitize_projects(conn, cached_projects)) {
                    return sanitized;
                }
            }
            logger::info!("PROJECT_CACHE_IS_EMPTY", 0);
        }
    }
    
    let _ = db_worker.run_sync(|conn| {
        if let Err(err) = clear_project_cache(conn) {
            logger::error!("CLEAR_PROJECT_CACHE_FAILED", err.log_details());
        }
    });
    logger::info!("PROJECT_CACHE_CLEARED", "PROJECT_CACHE_CLEARED");

    let projects = scan_all_projects();
    logger::info!("PROJECTS_SCANNED", projects.len());

    let projects_to_save = projects.clone();
    if let Ok(sanitized) = db_worker.run_sync(move |conn| {
        if let Err(err) = add_projects_in_db(conn, &projects_to_save) {
            logger::error!("ADD_PROJECTS_IN_DB_FAILED", err.log_details());
        }
        sanitize_projects(conn, projects_to_save)
    }) {
        return sanitized;
    }

    projects
}

#[tauri::command]
pub async fn sync_scan_projects(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Project>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_projects", move || {
            scan_projects_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_projects(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Project>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("scan_projects", move || {
            scan_projects_using_cache(&db_worker, true)
        })
        .await
}

#[tauri::command]
pub async fn update_project_pin_status(
    state: tauri::State<'_, AppState>,
    id: String,
    pinned: bool,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            update_project_pin_status_in_db(conn, &id, pinned).map_err(|err| {
                logger::error!("UPDATE_PROJECT_PIN_STATUS_FAILED", err.log_details());
                err.to_user_message()
            })?;
            logger::info!("UPDATE_PROJECT_PIN_STATUS_SUCCESS", id, pinned);
            Ok(())
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn update_project_status(
    state: tauri::State<'_, AppState>,
    id: String,
    status: String,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            update_project_status_in_db(conn, &id, &status).map_err(|err| {
                logger::error!("UPDATE_PROJECT_STATUS_FAILED", err.log_details());
                err.to_user_message()
            })?;
            logger::info!("UPDATE_PROJECT_STATUS_SUCCESS", id, status);
            Ok(())
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn update_project_tags(
    state: tauri::State<'_, AppState>,
    id: String,
    tags: Vec<String>,
) -> Result<(), String> {
    state
        .db_worker
        .run(move |conn| {
            let tags = tags
                .iter()
                .filter_map(|tag| Tag::from_string(tag))
                .collect();
            update_project_tags_in_db(conn, &id, &tags).map_err(|err| {
                logger::error!("UPDATE_PROJECT_TAGS_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub async fn reset_project_table(state: tauri::State<'_, AppState>) -> Result<(), String> {
    state
        .db_worker
        .run(|conn| {
            reset_project_table_in_db(conn).map_err(|err| {
                logger::error!("RESET_PROJECT_TABLE_FAILED", err.log_details());
                err.to_user_message()
            })
        })
        .await
        .map_err(|e| e)?
}

#[tauri::command]
pub fn scan_project_tags(project: Project) -> Result<Vec<Tag>, String> {
    let tags = scan_tags(&project);
    Ok(tags)
}
