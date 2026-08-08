use crate::dusty::{
    data::session::Session,
    error::{DustyError, Result},
};
use rusqlite::{params, Connection};

pub fn create_session_cache_table(db: &Connection) -> Result<()> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS session_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )",
        [],
    )
    .map_err(|err| DustyError::db("create_session_cache_table", Some("session_cache".to_string()), err))?;
    Ok(())
}

pub fn add_or_update_session_cache(db: &Connection, session: &Session) -> Result<()> {
    let id = session.id.clone();
    let data = serde_json::to_string(session)
        .map_err(|e| DustyError::serde("serialize_session", e))?;

    db.execute(
        "INSERT OR REPLACE INTO session_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| DustyError::db("add_or_update_session_cache", Some("session_cache".to_string()), err))?;
    Ok(())
}

pub fn get_session_cache(db: &Connection, id: String) -> Result<Option<Session>> {
    let mut stmt = db
        .prepare("SELECT data FROM session_cache WHERE id = ?1")
        .map_err(|err| DustyError::db("prepare_get_session_cache", Some("session_cache".to_string()), err))?;

    let result = stmt.query_row(params![id], |row| {
        let data: String = row.get(0)?;
        Ok(data)
    });

    match result {
        Ok(data) => {
            let session = serde_json::from_str::<Session>(&data)
                .map_err(|e| DustyError::serde("deserialize_session", e))?;
            Ok(Some(session))
        }
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(DustyError::db("get_session_cache", Some("session_cache".to_string()), err)),
    }
}

pub fn reset_session_cache(conn: &Connection) -> Result<()> {
    conn.execute("DROP TABLE IF EXISTS session_cache", [])
        .map_err(|err| DustyError::db("reset_session_cache_drop", Some("session_cache".to_string()), err))?;
    create_session_cache_table(conn)
}

pub fn get_value_by_session_id_in_db(db: &Connection, id: String) -> Result<String> {
    match get_session_cache(db, id.clone())? {
        Some(session) => Ok(session.value),
        None => Err(DustyError::Custom(format!("Session '{}' not found", id))),
    }
}

pub fn add_or_update_by_session_id_in_db(
    db: &Connection,
    id: String,
    value: String,
) -> Result<()> {
    let session = Session { id, value };
    add_or_update_session_cache(db, &session)
}
