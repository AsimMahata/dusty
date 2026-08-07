use std::sync::Mutex;

use rusqlite::{Connection, Result, params};
use tauri::Manager;

use crate::dusty::data::state::AppState;
use crate::dusty::db::media::create_media_table;
use crate::dusty::db::misc::create_empty_dir_cache_table;
use crate::dusty::db::misc::create_misc_cache_table;
use crate::dusty::db::misc::create_misc_dir_cache_table;
use crate::dusty::db::project::create_projects_table;
use crate::dusty::db::recent::create_recent_ep_table;
use crate::dusty::db::session::create_session_cache_table;
use crate::dusty::db::show::create_show_cache_table;
use crate::dusty::db::show::create_shows_table;
use crate::dusty::db::show::create_show_scan_cache_table;
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
    
    // Create new structures
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

    // Run database migrations for the generic show rewrite
    if let Err(e) = run_database_migrations(conn) {
        logger::error!("DATABASE_MIGRATION_FAILED", e);
    }

    Ok(tables)
}

pub fn run_database_migrations(conn: &Connection) -> Result<(), String> {
    // 1. Migrate mal_cache to show_cache
    let has_mal_cache: bool = conn.query_row(
        "SELECT COUNT(*) FROM pragma_table_info('mal_cache')",
        [],
        |row| row.get(0),
    ).unwrap_or(0) > 0;

    if has_mal_cache {
        let mut stmt = conn.prepare("SELECT id, provider_id FROM shows WHERE provider = 'mal'").map_err(|e| e.to_string())?;
        let show_rows = stmt.query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        }).map_err(|e| e.to_string())?;

        for row in show_rows {
            if let Ok((show_id, provider_id)) = row {
                let old_cache_key = crate::dusty::utility::sha256_hash::get_sha256_id("mal".to_string(), provider_id.clone());
                let payload: Option<String> = conn.query_row(
                    "SELECT data FROM mal_cache WHERE id = ?1",
                    params![old_cache_key],
                    |row| row.get(0)
                ).ok();

                if let Some(data) = payload {
                    let _ = conn.execute(
                        "INSERT OR REPLACE INTO show_cache (show_id, provider, payload, updated_at) VALUES (?1, 'mal', ?2, datetime('now'))",
                        params![show_id, data]
                    );
                }
            }
        }
    }

    // 2. Migrate tmdb_cache to show_cache
    let has_tmdb_cache: bool = conn.query_row(
        "SELECT COUNT(*) FROM pragma_table_info('tmdb_cache')",
        [],
        |row| row.get(0),
    ).unwrap_or(0) > 0;

    if has_tmdb_cache {
        let mut stmt = conn.prepare("SELECT id, provider_id FROM shows WHERE provider = 'tmdb'").map_err(|e| e.to_string())?;
        let show_rows = stmt.query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        }).map_err(|e| e.to_string())?;

        for row in show_rows {
            if let Ok((show_id, provider_id)) = row {
                let old_cache_key = crate::dusty::utility::sha256_hash::get_sha256_id("tmdb".to_string(), provider_id.clone());
                let payload: Option<String> = conn.query_row(
                    "SELECT data FROM tmdb_cache WHERE id = ?1",
                    params![old_cache_key],
                    |row| row.get(0)
                ).ok();

                if let Some(data) = payload {
                    let _ = conn.execute(
                        "INSERT OR REPLACE INTO show_cache (show_id, provider, payload, updated_at) VALUES (?1, 'tmdb', ?2, datetime('now'))",
                        params![show_id, data]
                    );
                }
            }
        }
    }

    // 3. Drop obsolete tables
    let _ = conn.execute("DROP TABLE IF EXISTS anime;", []);
    let _ = conn.execute("DROP TABLE IF EXISTS tv_show;", []);
    let _ = conn.execute("DROP TABLE IF EXISTS mal_cache;", []);
    let _ = conn.execute("DROP TABLE IF EXISTS tmdb_cache;", []);

    Ok(())
}
