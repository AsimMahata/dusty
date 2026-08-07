use crate::dusty::{logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{params, Connection};

pub fn create_tmdb_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS tmdb_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_TMDB_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_to_tmdb_cache_in_db(db: &Connection, id: String, data: String) -> Result<(), String> {
    let id = get_sha256_id("tmdb".to_string(), id.clone());
    db.execute(
        "INSERT OR REPLACE INTO tmdb_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| err.to_string())?;
    Ok(())
}

pub fn get_from_tmdb_cache_in_db(db: &Connection, id: String) -> Result<Option<String>, String> {
    let id = get_sha256_id("tmdb".to_string(), id);
    let mut stmt = db
        .prepare("SELECT data FROM tmdb_cache WHERE id = ?1")
        .map_err(|err| {
            logger::error!("PREPARE_GET_FROM_TMDB_CACHE_FAILED", err);
            err.to_string()
        })?;
    let result = stmt.query_row(params![id], |row| row.get(0));
    match result {
        Ok(data) => Ok(Some(data)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("QUERY_GET_FROM_TMDB_CACHE_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn update_in_tmdb_cache_in_db(db: &Connection, id: String, data: String) -> Result<(), String> {
    let id = get_sha256_id("tmdb".to_string(), id.clone());
    db.execute(
        "UPDATE tmdb_cache SET data = ?1 WHERE id = ?2",
        params![data, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_IN_TMDB_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn reset_tmdb_cache_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS tmdb_cache", [])
        .map_err(|err| {
            logger::error!("RESET_TMDB_CACHE_TABLE_FAILED", err);
            err.to_string()
        })?;
    create_tmdb_cache_table(conn).map_err(|err| {
        logger::error!("RESET_TMDB_CACHE_TABLE_CREATE_FAILED", err);
        err.to_string()
    })
}
