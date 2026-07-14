use std::sync::Mutex;

use rusqlite::{Connection, Result};
use tauri::Manager;

use crate::dusty::data::state::AppState;
use crate::dusty::db::ban::create_ban_table;
use crate::dusty::db::show::create_shows_table;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn init_db(app: &mut tauri::App) -> Result<(), String> {
    let app_data_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    let db_dir = app_data_dir.join("database");
    std::fs::create_dir_all(&db_dir).map_err(|e| e.to_string())?;

    let db_path = db_dir.join("dusty.db");
    logger::info!("DB path: {:?}", db_path);

    let conn = rusqlite::Connection::open(db_path).map_err(|e| e.to_string())?;

    create_shows_table(&conn)?;
    create_ban_table(&conn)?;

    app.manage(AppState {
        db: Mutex::new(conn),
    });

    Ok(())
}
