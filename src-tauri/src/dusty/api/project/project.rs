use crate::dusty::db::project::add_projects_in_db;
use crate::dusty::db::project::clear_project_cache;
use crate::dusty::db::project::get_project_cache_from_db;
use crate::dusty::db::project::get_project_info_from_db;
use crate::dusty::db::project::reset_project_table_in_db;
use crate::dusty::db::project::update_project_pin_status_in_db;
use crate::dusty::db::project::update_project_status_in_db;
use crate::dusty::db::project::update_project_tags_in_db;
use crate::dusty::engine::project::scanner::scan_all_projects;

use crate::dusty::engine::project::tag_scanner::scan_tags;
use crate::dusty::logger::logger;
use crate::dusty::models::project::Project;
use crate::dusty::models::project::Tag;
use crate::dusty::models::state::AppState;
use crate::dusty::multithreading::temp_workers;
use crate::dusty::system::git::get_git_info_sys;
use crate::dusty::system::git::GitInfo;
use rusqlite::Connection;

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
            p.git_info = None;
            p
        })
        .collect()
}

use crate::dusty::multithreading::DbWorker;

pub fn scan_projects_using_cache(db_worker: &DbWorker, cache: bool) -> Vec<Project> {
    if cache {
        if let Ok(Ok(cached_projects)) = db_worker.run_sync(|conn| get_project_cache_from_db(conn))
        {
            logger::info!("PROJECT_CACHE_LOADED", cached_projects.len());
            if !cached_projects.is_empty() {
                logger::info!("PROJECT_CACHE_NOT_EMPTY", cached_projects.len());
                if let Ok(sanitized) =
                    db_worker.run_sync(|conn| sanitize_projects(conn, cached_projects))
                {
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
pub async fn sync_scan_projects(state: tauri::State<'_, AppState>) -> Result<Vec<Project>, String> {
    let db_worker = state.db_worker.clone();
    state
        .thread_pool
        .execute_with_result("sync_scan_projects", move || {
            scan_projects_using_cache(&db_worker, false)
        })
        .await
}

#[tauri::command]
pub async fn scan_projects(state: tauri::State<'_, AppState>) -> Result<Vec<Project>, String> {
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

#[tauri::command]
pub async fn fetch_projects_git_status(
    state: tauri::State<'_, AppState>,
) -> Result<std::collections::HashMap<String, GitInfo>, String> {
    let db_worker = state.db_worker.clone();

    let projects = db_worker
        .run_sync(|conn| get_project_cache_from_db(conn))
        .map_err(|e| e)?
        .map_err(|err| err.to_user_message())?;

    if projects.is_empty() {
        return Ok(std::collections::HashMap::new());
    }

    const BATCH_SIZE: usize = 10;
    let chunks: Vec<Vec<(String, String)>> = projects
        .chunks(BATCH_SIZE)
        .map(|chunk| {
            chunk
                .iter()
                .map(|p| (p.id.clone(), p.path.clone()))
                .collect()
        })
        .collect();

    let jobs: Vec<_> = chunks
        .into_iter()
        .map(|batch| {
            move || {
                let mut batch_results = Vec::with_capacity(batch.len());
                for (id, path) in batch {
                    let git_info = get_git_info_sys(&path);
                    batch_results.push((id, git_info));
                }
                batch_results
            }
        })
        .collect();

    let batch_results: Vec<Vec<(String, GitInfo)>> =
        tokio::task::spawn_blocking(move || temp_workers(jobs))
            .await
            .map_err(|e| e.to_string())?;

    let git_status_map: std::collections::HashMap<String, GitInfo> =
        batch_results.into_iter().flatten().collect();

    Ok(git_status_map)
}

#[tauri::command]
pub async fn fetch_all_project_tags(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Project>, String> {
    let db_worker = state.db_worker.clone();

    let projects = db_worker
        .run_sync(|conn| get_project_cache_from_db(conn))
        .map_err(|e| e)?
        .map_err(|err| err.to_user_message())?;

    if projects.is_empty() {
        return Ok(Vec::new());
    }

    const BATCH_SIZE: usize = 10;
    let chunks: Vec<Vec<Project>> = projects
        .chunks(BATCH_SIZE)
        .map(|chunk| chunk.to_vec())
        .collect();

    let jobs: Vec<_> = chunks
        .into_iter()
        .map(|batch| {
            move || {
                let mut batch_results = Vec::with_capacity(batch.len());
                for project in batch {
                    let tags = scan_tags(&project);
                    batch_results.push((project.id.clone(), tags));
                }
                batch_results
            }
        })
        .collect();

    let batch_results: Vec<Vec<(String, Vec<Tag>)>> =
        tokio::task::spawn_blocking(move || temp_workers(jobs))
            .await
            .map_err(|e| e.to_string())?;

    let all_tags_results: Vec<(String, Vec<Tag>)> = batch_results.into_iter().flatten().collect();

    let tags_to_save = all_tags_results.clone();
    let updated_projects = db_worker
        .run(move |conn| {
            let tx = conn.unchecked_transaction().map_err(|err| {
                crate::dusty::error::DustyError::db("tx_begin", Some("projects".to_string()), err)
            })?;

            for (id, tags) in &tags_to_save {
                if let Err(err) = update_project_tags_in_db(conn, id, tags) {
                    logger::error!("UPDATE_PROJECT_TAGS_IN_DB_FAILED", err.log_details());
                }
            }

            tx.commit().map_err(|err| {
                crate::dusty::error::DustyError::db("tx_commit", Some("projects".to_string()), err)
            })?;

            let cached = get_project_cache_from_db(conn).unwrap_or_default();
            Ok::<Vec<Project>, crate::dusty::error::DustyError>(sanitize_projects(conn, cached))
        })
        .await
        .map_err(|e| e)?
        .map_err(|err| err.to_user_message())?;

    Ok(updated_projects)
}
