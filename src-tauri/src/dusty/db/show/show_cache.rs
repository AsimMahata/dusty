use crate::dusty::logger::logger;
use rusqlite::{params, Connection};

pub fn create_show_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS show_cache (
            show_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            PRIMARY KEY (show_id, provider)
        )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn upsert_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
    payload: String,
) -> Result<(), String> {
    db.execute(
        "INSERT OR REPLACE INTO show_cache (show_id, provider, payload, updated_at) VALUES (?1, ?2, ?3, datetime('now'))",
        params![show_id, provider, payload],
    )
    .map_err(|err| {
        logger::error!("UPSERT_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_from_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
) -> Result<Option<String>, String> {
    let mut stmt = db
        .prepare("SELECT payload FROM show_cache WHERE show_id = ?1 AND provider = ?2")
        .map_err(|err| {
            logger::error!("PREPARE_GET_FROM_SHOW_CACHE_FAILED", err);
            err.to_string()
        })?;
    let result = stmt.query_row(params![show_id, provider], |row| row.get(0));
    match result {
        Ok(payload) => Ok(Some(payload)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("QUERY_GET_FROM_SHOW_CACHE_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn delete_from_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
) -> Result<(), String> {
    db.execute(
        "DELETE FROM show_cache WHERE show_id = ?1 AND provider = ?2",
        params![show_id, provider],
    )
    .map_err(|err| {
        logger::error!("DELETE_FROM_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn reset_show_cache_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS show_cache", [])
        .map_err(|err| {
            logger::error!("RESET_SHOW_CACHE_TABLE_FAILED", err);
            err.to_string()
        })?;
    create_show_cache_table(conn)
}
