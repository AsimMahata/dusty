use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use rusqlite::params;
use rusqlite::Connection;

pub fn create_show_cache_table(db: &Connection) -> Result<()> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS show_cache (
            show_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            PRIMARY KEY (show_id, provider)
        )",
        [],
    )
    .map_err(|err| {
        DustyError::db(
            "create_show_cache_table",
            Some("show_cache".to_string()),
            err,
        )
    })?;

    use crate::dusty::db::core::init::ensure_column_exists;
    ensure_column_exists(
        db,
        "show_cache",
        "created_at",
        "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
    )?;
    ensure_column_exists(
        db,
        "show_cache",
        "updated_at",
        "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
    )?;

    Ok(())
}

pub fn upsert_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
    payload: String,
) -> Result<()> {
    db.execute(
        "INSERT OR REPLACE INTO show_cache (show_id, provider, payload, updated_at) VALUES (?1, ?2, ?3, datetime('now'))",
        params![show_id, provider, payload],
    )
    .map_err(|err| DustyError::db("upsert_show_cache", Some("show_cache".to_string()), err))?;
    Ok(())
}

pub fn get_from_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
) -> Result<Option<String>> {
    let mut stmt = db
        .prepare("SELECT payload FROM show_cache WHERE show_id = ?1 AND provider = ?2")
        .map_err(|err| {
            DustyError::db(
                "prepare_get_show_cache",
                Some("show_cache".to_string()),
                err,
            )
        })?;
    let result = stmt.query_row(params![show_id, provider], |row| row.get(0));
    match result {
        Ok(payload) => Ok(Some(payload)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(DustyError::db(
            "query_get_show_cache",
            Some("show_cache".to_string()),
            err,
        )),
    }
}

pub fn delete_from_show_cache_in_db(
    db: &Connection,
    show_id: String,
    provider: String,
) -> Result<()> {
    db.execute(
        "DELETE FROM show_cache WHERE show_id = ?1 AND provider = ?2",
        params![show_id, provider],
    )
    .map_err(|err| DustyError::db("delete_show_cache", Some("show_cache".to_string()), err))?;
    Ok(())
}

pub fn reset_show_cache_table_in_db(conn: &Connection) -> Result<()> {
    conn.execute("DROP TABLE IF EXISTS show_cache", [])
        .map_err(|err| {
            DustyError::db("reset_show_cache_drop", Some("show_cache".to_string()), err)
        })?;
    create_show_cache_table(conn)
}
