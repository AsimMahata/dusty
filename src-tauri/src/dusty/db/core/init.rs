use rusqlite::Connection;
use std::path::PathBuf;
use tauri::Manager;

use crate::dusty::db::media::create_media_table;
use crate::dusty::db::misc::create_empty_dir_cache_table;
use crate::dusty::db::misc::create_misc_cache_table;
use crate::dusty::db::misc::create_misc_dir_cache_table;
use crate::dusty::db::project::create_projects_table;
use crate::dusty::db::recent::create_recent_ep_table;
use crate::dusty::db::show::create_show_cache_table;
use crate::dusty::db::show::create_show_scan_cache_table;
use crate::dusty::db::show::create_shows_table;
use crate::dusty::error::DustyError;
use crate::dusty::error::Result as DustyResult;
use crate::dusty::logger::logger;
use crate::dusty::models::state::AppState;
use crate::dusty::multithreading::BackgroundWorker;
use crate::dusty::multithreading::DbWorker;
use crate::dusty::multithreading::P2PWorker;
use crate::dusty::multithreading::ThreadPool;
use std::sync::atomic::AtomicU64;
use std::sync::Arc;

fn init_fs_related_task(app: &mut tauri::App) -> DustyResult<PathBuf> {
    let app_data_dir = app.path().app_local_data_dir().map_err(|e| {
        let err = DustyError::io_op(
            "get_app_local_data_dir",
            std::io::Error::new(std::io::ErrorKind::Other, e.to_string()),
        );
        logger::error!("INIT_DB_AND_OS_FAILED", err.log_details());
        err
    })?;
    let db_dir = app_data_dir.join("database");
    std::fs::create_dir_all(&db_dir).map_err(|e| {
        let err = DustyError::io("create_db_directory", &db_dir, e);
        logger::error!("INIT_DB_AND_OS_FAILED", err.log_details());
        err
    })?;

    let db_path = db_dir.join("dusty.db");
    logger::info!("DB path: {:?}", db_path);
    Ok(db_path)
}

pub fn initialize_dusty(app: &mut tauri::App) -> Result<(), DustyError> {
    let db_path = init_fs_related_task(app)?;

    let conn = rusqlite::Connection::open(&db_path).map_err(|e| {
        let err = DustyError::db("open_db_connection", None, e);
        logger::error!("INIT_DB_AND_OS_FAILED", err.log_details());
        err
    })?;

    let tables: Vec<String> = initialize_tables(&conn).map_err(|e| {
        logger::error!("INIT_DB_TABLES_FAILED", e.log_details());
        e
    })?;

    let view_epoch = Arc::new(AtomicU64::new(0));
    let db_worker = DbWorker::new(conn, Arc::clone(&view_epoch));
    let thread_pool = ThreadPool::new(2, Arc::clone(&view_epoch));
    let p2p_worker = P2PWorker::new();
    let background_worker = BackgroundWorker::new();

    logger::info!("Tables initialized: {:?}", tables);
    app.manage(AppState {
        db_worker,
        tables: tables,
        os: std::env::consts::OS.to_string(),
        thread_pool,
        view_epoch,
        p2p_worker,
        background_worker,
    });

    Ok(())
}



pub fn initialize_tables(conn: &Connection) -> DustyResult<Vec<String>> {
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

    Ok(tables)
}

pub fn ensure_column_exists(
    conn: &Connection,
    table: &str,
    column: &str,
    column_def: &str,
) -> DustyResult<()> {
    let pragma_sql = format!("PRAGMA table_info({})", table);
    let mut stmt = conn
        .prepare(&pragma_sql)
        .map_err(|err| DustyError::db("prepare_pragma_table_info", Some(table.to_string()), err))?;
    let has_column = stmt
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(|err| DustyError::db("query_pragma_table_info", Some(table.to_string()), err))?
        .filter_map(std::result::Result::ok)
        .any(|col| col == column);

    if !has_column {
        let alter_sql = format!("ALTER TABLE {} ADD COLUMN {} {}", table, column, column_def);
        conn.execute(&alter_sql, []).map_err(|err| {
            DustyError::db("alter_table_add_column", Some(table.to_string()), err)
        })?;
    }
    Ok(())
}
