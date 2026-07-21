use rusqlite::Connection;

use crate::dusty::api::project;
use crate::dusty::data::project::Project;
use crate::dusty::data::state::AppState;
use crate::dusty::db::project::{
    add_projects_in_db, get_project_cache_from_db, get_project_info_from_db,
    reset_project_table_in_db, update_project_pin_status_in_db, update_project_status_in_db,
};
use crate::dusty::engine::project::scanner::scan_all_projects;
use crate::dusty::logger::logger;


pub fn sanitize_projects(db: &Connection, projects: Vec<Project>) -> Vec<Project> {
    projects
        .into_iter()
        .map(|mut p| {
            if let Ok(info) = get_project_info_from_db(&db, &p.id) {
                p.project_type = info.project_type;
                p.pinned = info.pinned;
                p.status = info.status;
            }
            p
        })
        .collect()
}

pub fn scan_projects_using_cache(db: &Connection, cache: bool) -> Vec<Project> {
    if cache {
        let cached_project = match get_project_cache_from_db(db)
            .map_err(|err| logger::error!("PROJECT_CACHE_FROM_DB_ERROR", err))
            .ok()
        {
            Some(cached_projects) => cached_projects,
            _ => Vec::new(),
        };
        logger::info!("PROJECT_CACHE_LOADED", cached_project.len());
        if !cached_project.is_empty() {
            logger::info!("PROJECT_CACHE_NOT_EMPTY", cached_project.len());
            return sanitize_projects(&db, cached_project);
        }
        logger::info!("PROJECT_CACHE_IS_EMPTY", cached_project.len());
    }
    let projects = scan_all_projects();
    add_projects_in_db(&db, &projects)
        .map_err(|err| logger::error!("ADD_PROJECTS_IN_DB_FAILED", err))
        .ok();
    sanitize_projects(&db, projects)
}

#[tauri::command]
pub fn sync_scan_projects(state: tauri::State<AppState>) -> Vec<Project> {
    let db = state.db.lock().unwrap();
    scan_projects_using_cache(&db, false)
}

#[tauri::command]
pub fn scan_projects(state: tauri::State<AppState>) -> Vec<Project> {
    let db = state.db.lock().unwrap();
    scan_projects_using_cache(&db, true)
}

#[tauri::command]
pub fn update_project_pin_status(
    state: tauri::State<AppState>,
    id: String,
    pinned: bool,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_project_pin_status_in_db(&db, &id, pinned) {
        logger::error!("UPDATE_PROJECT_PIN_STATUS_FAILED", err.clone());
        return Err(err);
    }
    logger::info!("UPDATE_PROJECT_PIN_STATUS_SUCCESS", id, pinned);
    Ok(())
}

#[tauri::command]
pub fn update_project_status(
    state: tauri::State<AppState>,
    id: String,
    status: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_project_status_in_db(&db, &id, &status) {
        logger::error!("UPDATE_PROJECT_STATUS_FAILED", err.clone());
        return Err(err);
    }
    logger::info!("UPDATE_PROJECT_STATUS_SUCCESS", id, status);
    Ok(())
}

#[tauri::command]
pub fn reset_project_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    reset_project_table_in_db(&db)
        .map_err(|err| logger::error!("RESET_PROJECT_TABLE_IN_DB_FAILED", err))
        .ok();
    Ok(())
}
