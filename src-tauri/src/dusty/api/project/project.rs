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
use crate::dusty::error::DustyError;
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

pub fn scan_projects_using_cache(db: &Connection, cache: bool) -> Vec<Project> {
    if cache {
        let cached_project = match get_project_cache_from_db(db) {
            Ok(cached_projects) => cached_projects,
            Err(err) => {
                logger::error!("PROJECT_CACHE_FROM_DB_ERROR", err.log_details());
                Vec::new()
            }
        };
        logger::info!("PROJECT_CACHE_LOADED", cached_project.len());
        if !cached_project.is_empty() {
            logger::info!("PROJECT_CACHE_NOT_EMPTY", cached_project.len());
            return sanitize_projects(&db, cached_project);
        }
        logger::info!("PROJECT_CACHE_IS_EMPTY", cached_project.len());
    }
    
    if let Err(err) = clear_project_cache(db) {
        logger::error!("CLEAR_PROJECT_CACHE_FAILED", err.log_details());
    }
    logger::info!("PROJECT_CACHE_CLEARED", "PROJECT_CACHE_CLEARED");
    let projects = scan_all_projects();
    logger::info!("PROJECTS_SCANNED", projects.len());
    if let Err(err) = add_projects_in_db(&db, &projects) {
        logger::error!("ADD_PROJECTS_IN_DB_FAILED", err.log_details());
    }
    sanitize_projects(&db, projects)
}

#[tauri::command]
pub fn sync_scan_projects(state: tauri::State<AppState>) -> Vec<Project> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("sync_scan_projects");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_projects_using_cache(&db, false)
}

#[tauri::command]
pub fn scan_projects(state: tauri::State<AppState>) -> Vec<Project> {
    let db = match state.db.lock() {
        Ok(guard) => guard,
        Err(_) => {
            let err = DustyError::lock("scan_projects");
            logger::error!("DB_LOCK_FAILED", err.log_details());
            return Vec::new();
        }
    };
    scan_projects_using_cache(&db, true)
}

#[tauri::command]
pub fn update_project_pin_status(
    state: tauri::State<AppState>,
    id: String,
    pinned: bool,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("update_project_pin_status");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    update_project_pin_status_in_db(&db, &id, pinned).map_err(|err| {
        logger::error!("UPDATE_PROJECT_PIN_STATUS_FAILED", err.log_details());
        err.to_user_message()
    })?;
    logger::info!("UPDATE_PROJECT_PIN_STATUS_SUCCESS", id, pinned);
    Ok(())
}

#[tauri::command]
pub fn update_project_status(
    state: tauri::State<AppState>,
    id: String,
    status: String,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("update_project_status");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    update_project_status_in_db(&db, &id, &status).map_err(|err| {
        logger::error!("UPDATE_PROJECT_STATUS_FAILED", err.log_details());
        err.to_user_message()
    })?;
    logger::info!("UPDATE_PROJECT_STATUS_SUCCESS", id, status);
    Ok(())
}

#[tauri::command]
pub fn update_project_tags(
    state: tauri::State<AppState>,
    id: String,
    tags: Vec<String>,
) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("update_project_tags");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    let tags = tags
        .iter()
        .filter_map(|tag| Tag::from_string(tag))
        .collect();
    update_project_tags_in_db(&db, &id, &tags).map_err(|err| {
        logger::error!("UPDATE_PROJECT_TAGS_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn reset_project_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_project_table");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    reset_project_table_in_db(&db).map_err(|err| {
        logger::error!("RESET_PROJECT_TABLE_FAILED", err.log_details());
        err.to_user_message()
    })
}

#[tauri::command]
pub fn scan_project_tags(project: Project) -> Result<Vec<Tag>, String> {
    let tags = scan_tags(&project);
    Ok(tags)
}
