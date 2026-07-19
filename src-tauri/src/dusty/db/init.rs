use std::sync::Mutex;

use rusqlite::{Connection, Result};
use tauri::Manager;

use crate::dusty::data::state::AppState;
use crate::dusty::db::anime::create_anime_table;
use crate::dusty::db::mal::create_mal_cache_table;
use crate::dusty::db::project::create_projects_table;
use crate::dusty::db::show::create_shows_table;
use crate::dusty::db::media::create_media_table;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn init_db_and_os(app: &mut tauri::App) -> Result<(), String> {
    let app_data_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    let db_dir = app_data_dir.join("database");
    std::fs::create_dir_all(&db_dir).map_err(|e| e.to_string())?;

    let db_path = db_dir.join("dusty.db");
    logger::info!("DB path: {:?}", db_path);

    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    let tables: Vec<String> = initialize_tables(&conn)?;
    logger::info!("Tables initialized: {:?}", tables);
    app.manage(AppState {
        db: Mutex::new(conn),
        tables: tables,
        os: std::env::consts::OS.to_string(),
    });

    Ok(())
}

pub fn initialize_tables(conn: &Connection) -> Result<Vec<String>, String> {
    let mut tables: Vec<String> = Vec::new();
    create_shows_table(&conn)?;
    tables.push("shows".to_string());
    create_projects_table(&conn)?;
    tables.push("projects".to_string());
    create_media_table(&conn)?;
    tables.push("media_cache".to_string());
    create_mal_cache_table(&conn)?;
    tables.push("mal_cache".to_string());
    create_anime_table(&conn)?;
    tables.push("anime".to_string());
    Ok(tables)
}

