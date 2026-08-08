use std::sync::Mutex;

use rusqlite::{Connection, Result};
use tauri::Manager;

use crate::dusty::data::state::AppState;
use crate::dusty::db::media::create_media_table;
use crate::dusty::db::misc::{
    create_empty_dir_cache_table, create_misc_cache_table, create_misc_dir_cache_table,
};
use crate::dusty::db::project::create_projects_table;
use crate::dusty::db::recent::create_recent_ep_table;
use crate::dusty::db::session::create_session_cache_table;
use crate::dusty::db::show::create_show_cache_table;
use crate::dusty::db::show::create_show_scan_cache_table;
use crate::dusty::db::show::create_shows_table;
use crate::dusty::db::user::create_user_table;
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

    create_shows_table(conn)?;
    tables.push("shows".to_string());

    create_show_cache_table(conn)?;
    tables.push("show_cache".to_string());

    create_show_scan_cache_table(conn)?;
    tables.push("show_scan_cache".to_string());

    create_projects_table(conn)?;
    tables.push("projects".to_string());
    tables.push("project_cache".to_string());

    create_media_table(conn)?;
    tables.push("media_cache".to_string());

    create_empty_dir_cache_table(conn)?;
    tables.push("empty_dir_cache".to_string());

    create_misc_cache_table(conn)?;
    tables.push("misc_cache".to_string());

    create_misc_dir_cache_table(conn)?;
    tables.push("misc_dir_cache".to_string());

    create_recent_ep_table(conn)?;
    tables.push("recent_episodes".to_string());

    create_session_cache_table(conn)?;
    tables.push("session_cache".to_string());

    create_user_table(conn)?;
    tables.push("user".to_string());

    Ok(tables)
}

pub fn ensure_column_exists(
    conn: &Connection,
    table: &str,
    column: &str,
    column_def: &str,
) -> Result<(), String> {
    let pragma_sql = format!("PRAGMA table_info({})", table);
    let mut stmt = conn.prepare(&pragma_sql).map_err(|e| e.to_string())?;
    let has_column = stmt
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
        .any(|col| col == column);

    if !has_column {
        let alter_sql = format!("ALTER TABLE {} ADD COLUMN {} {}", table, column, column_def);
        conn.execute(&alter_sql, []).map_err(|e| e.to_string())?;
    }
    Ok(())
}
