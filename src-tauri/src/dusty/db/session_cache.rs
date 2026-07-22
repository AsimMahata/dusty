use crate::dusty::{data::session::Session, logger::logger};
use rusqlite::{params, Connection};

pub fn create_session_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS session_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_SESSION_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_or_update_session_cache(db: &Connection, session: &Session) -> Result<(), String> {
    let id = session.id.clone();
    let data = serde_json::to_string(session).map_err(|err| {
        logger::error!("SERIALIZE_SESSION_FAILED", err);
        err.to_string()
    })?;
    
    db.execute(
        "INSERT OR REPLACE INTO session_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| {
        logger::error!("INSERT_OR_REPLACE_SESSION_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_session_cache(db: &Connection, id: String) -> Result<Option<Session>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM session_cache WHERE id = ?1")
        .map_err(|err| {
            logger::error!("PREPARE_GET_SESSION_CACHE_FAILED", err);
            err.to_string()
        })?;
    
    let result = stmt.query_row(params![id], |row| {
        let data: String = row.get(0)?;
        Ok(data)
    });

    match result {
        Ok(data) => {
            let session = serde_json::from_str::<Session>(&data).map_err(|err| {
                logger::error!("PARSE_SESSION_FAILED", err);
                err.to_string()
            })?;
            Ok(Some(session))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("GET_SESSION_CACHE_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn reset_session_cache(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS session_cache", [])
        .map_err(|err| {
            logger::error!("RESET_SESSION_CACHE_FAILED", err);
            err.to_string()
        })?;
    create_session_cache_table(conn)
}

pub fn get_value_by_session_id_in_db(db: &Connection, id: String) -> Result<String, String> {
    match get_session_cache(db, id)? {
        Some(session) => Ok(session.value),
        None => Err("Session not found".to_string()),
    }
}

pub fn add_or_update_by_session_id_in_db(
    db: &Connection,
    id: String,
    value: String,
) -> Result<(), String> {
    let session = Session { id, value };
    add_or_update_session_cache(db, &session)
}
