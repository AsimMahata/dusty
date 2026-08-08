use crate::dusty::{data::shows::ShowResult, logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{params, Connection};

pub fn create_show_scan_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS show_scan_cache (
            cache_key TEXT PRIMARY KEY,
            scan_root TEXT NOT NULL,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_SHOW_SCAN_CACHE_FAILED", err);
        err.to_string()
    })?;

    use crate::dusty::db::core::init::ensure_column_exists;
    let _ = ensure_column_exists(db, "show_scan_cache", "created_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))");
    let _ = ensure_column_exists(db, "show_scan_cache", "updated_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))");

    Ok(())
}

pub fn add_scan_to_cache(db: &Connection, scan_root: &str, shows: &Vec<ShowResult>) -> Result<(), String> {
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root.to_string());
    let payload = serde_json::to_string(shows).map_err(|e| e.to_string())?;
    db.execute(
        "INSERT OR REPLACE INTO show_scan_cache (cache_key, scan_root, payload, updated_at) VALUES (?1, ?2, ?3, datetime('now'))",
        params![cache_key, scan_root, payload],
    )
    .map_err(|err| {
        logger::error!("ADD_SCAN_TO_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_scan_from_cache(db: &Connection, scan_root: &str) -> Result<Option<Vec<ShowResult>>, String> {
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root.to_string());
    let mut stmt = db
        .prepare("SELECT payload FROM show_scan_cache WHERE cache_key = ?1")
        .map_err(|err| {
            logger::error!("PREPARE_GET_SCAN_FROM_CACHE_FAILED", err);
            err.to_string()
        })?;
    let result = stmt.query_row(params![cache_key], |row| {
        let payload: String = row.get(0)?;
        Ok(payload)
    });
    match result {
        Ok(payload) => {
            let shows: Vec<ShowResult> = serde_json::from_str(&payload).map_err(|e| e.to_string())?;
            Ok(Some(shows))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("QUERY_GET_SCAN_FROM_CACHE_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn delete_scan_cache_for_root(db: &Connection, scan_root: &str) -> Result<(), String> {
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root.to_string());
    db.execute("DELETE FROM show_scan_cache WHERE cache_key = ?1", params![cache_key])
        .map_err(|err| {
            logger::error!("DELETE_SCAN_CACHE_FAILED", err);
            err.to_string()
        })?;
    Ok(())
}

pub fn reset_show_scan_cache_table(db: &Connection) -> Result<(), String> {
    db.execute("DROP TABLE IF EXISTS show_scan_cache", [])
        .map_err(|err| {
            logger::error!("DROP_SHOW_SCAN_CACHE_FAILED", err);
            err.to_string()
        })?;
    create_show_scan_cache_table(db)
}
