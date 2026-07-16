use crate::dusty::{
    data::media::MediaDir,
    logger::logger,
};
use rusqlite::{params, Connection, Result};
use serde_json;

pub fn create_media_table(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS media_cache (
            id TEXT PRIMARY KEY,
            source TEXT NOT NULL,
            media_type TEXT NOT NULL,
            data TEXT NOT NULL
        )
        ",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_MEDIA_CACHE_TABLE_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn save_media_to_db(db: &Connection, source: &str, media_type: &str, data: &Vec<MediaDir>) -> Result<(), String> {
    let id = format!("{}_{}", source, media_type);
    let json_data = serde_json::to_string(data).map_err(|e| e.to_string())?;

    db.execute(
        "
        INSERT OR REPLACE INTO media_cache (id, source, media_type, data)
        VALUES (?1, ?2, ?3, ?4)
        ",
        params![id, source, media_type, json_data],
    )
    .map_err(|err| {
        logger::error!("SAVE_MEDIA_TO_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn get_media_from_db(db: &Connection, source: &str, media_type: &str) -> Result<Option<Vec<MediaDir>>, String> {
    let id = format!("{}_{}", source, media_type);
    
    let result = db.query_row(
        "SELECT data FROM media_cache WHERE id = ?1",
        params![id],
        |row| {
            let data: String = row.get(0)?;
            Ok(data)
        },
    );

    match result {
        Ok(json_data) => {
            let media_dirs: Vec<MediaDir> = serde_json::from_str(&json_data).map_err(|e| e.to_string())?;
            Ok(Some(media_dirs))
        },
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("GET_MEDIA_FROM_DB_FAILED", err);
            Err(err.to_string())
        }
    }
}
