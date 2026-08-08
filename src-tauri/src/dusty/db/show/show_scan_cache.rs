use std::path::Path;
use crate::dusty::{
    data::shows::ShowResult,
    error::{DustyError, Result},
    utility::sha256_hash::get_sha256_id,
};
use rusqlite::{params, Connection};

pub fn create_show_scan_cache_table(db: &Connection) -> Result<()> {
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
    .map_err(|err| DustyError::db("create_show_scan_cache_table", Some("show_scan_cache".to_string()), err))?;

    use crate::dusty::db::core::init::ensure_column_exists;
    ensure_column_exists(db, "show_scan_cache", "created_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;
    ensure_column_exists(db, "show_scan_cache", "updated_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;

    Ok(())
}

pub fn add_scan_to_cache(db: &Connection, scan_root: &Path, shows: &Vec<ShowResult>) -> Result<()> {
    let scan_root_str = scan_root.to_str().ok_or_else(|| {
        DustyError::invalid_path(scan_root, "Scan root path is not valid UTF-8")
    })?;
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root_str.to_string());
    let payload = serde_json::to_string(shows)
        .map_err(|e| DustyError::serde("serialize_show_scan_cache", e))?;
    db.execute(
        "INSERT OR REPLACE INTO show_scan_cache (cache_key, scan_root, payload, updated_at) VALUES (?1, ?2, ?3, datetime('now'))",
        params![cache_key, scan_root_str, payload],
    )
    .map_err(|err| DustyError::db("add_scan_to_cache", Some("show_scan_cache".to_string()), err))?;
    Ok(())
}

pub fn get_scan_from_cache(db: &Connection, scan_root: &Path) -> Result<Option<Vec<ShowResult>>> {
    let scan_root_str = scan_root.to_str().ok_or_else(|| {
        DustyError::invalid_path(scan_root, "Scan root path is not valid UTF-8")
    })?;
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root_str.to_string());
    let mut stmt = db
        .prepare("SELECT payload FROM show_scan_cache WHERE cache_key = ?1")
        .map_err(|err| DustyError::db("prepare_get_scan_cache", Some("show_scan_cache".to_string()), err))?;
    let result = stmt.query_row(params![cache_key], |row| {
        let payload: String = row.get(0)?;
        Ok(payload)
    });
    match result {
        Ok(payload) => {
            let shows: Vec<ShowResult> = serde_json::from_str(&payload)
                .map_err(|e| DustyError::serde("deserialize_show_scan_cache", e))?;
            Ok(Some(shows))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(DustyError::db("query_get_scan_cache", Some("show_scan_cache".to_string()), err)),
    }
}

pub fn delete_scan_cache_for_root(db: &Connection, scan_root: &Path) -> Result<()> {
    let scan_root_str = scan_root.to_str().ok_or_else(|| {
        DustyError::invalid_path(scan_root, "Scan root path is not valid UTF-8")
    })?;
    let cache_key = get_sha256_id("scan_root".to_string(), scan_root_str.to_string());
    db.execute("DELETE FROM show_scan_cache WHERE cache_key = ?1", params![cache_key])
        .map_err(|err| DustyError::db("delete_scan_cache", Some("show_scan_cache".to_string()), err))?;
    Ok(())
}

pub fn reset_show_scan_cache_table(db: &Connection) -> Result<()> {
    db.execute("DROP TABLE IF EXISTS show_scan_cache", [])
        .map_err(|err| DustyError::db("reset_show_scan_cache_drop", Some("show_scan_cache".to_string()), err))?;
    create_show_scan_cache_table(db)
}
