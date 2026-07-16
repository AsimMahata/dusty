use rusqlite::Connection;

use crate::dusty::data::project::Project;
use crate::dusty::data::state::AppState;
use crate::dusty::db::project::{
    add_projects_in_db, get_project_info_from_db, print_all_projects_in_db, reset_project_table_in_db, update_project_status_in_db, update_project_pin_status_in_db
    };
use crate::dusty::engine::project::scanner::scan_all_projects;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn scan_projects(state: tauri::State<AppState>) -> Vec<Project> {
    let projects: Vec<Project> = scan_all_projects();
    let db = state.db.lock().unwrap();
    add_projects_in_db(&db, &projects).map_err(|err| logger::error!("ADD_PROJECTS_IN_DB_FAILED", err)).ok();
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

#[tauri::command]
pub fn update_project_pin_status(state: tauri::State<AppState>, id: String, pinned: bool) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_project_pin_status_in_db(&db, &id, pinned) {
        logger::error!("UPDATE_PROJECT_PIN_STATUS_FAILED", err.clone());
        return Err(err);
    }
    logger::info!("UPDATE_PROJECT_PIN_STATUS_SUCCESS", id, pinned);
    Ok(())
}

#[tauri::command]
pub fn update_project_status(state: tauri::State<AppState>, id: String, status: String) -> Result<(), String> {
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
    reset_project_table_in_db(&db).map_err(|err| logger::error!("RESET_PROJECT_TABLE_IN_DB_FAILED", err)).ok();
    Ok(())
}