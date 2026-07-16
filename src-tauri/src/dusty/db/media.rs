use std::collections::HashMap;

use crate::dusty::{
    data::media::MediaDir, logger::logger, utility::sha256_hash::get_sha256_id,
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
    let id = get_sha256_id(source.to_string(),media_type.to_string());
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
    let id = get_sha256_id(source.to_string(),media_type.to_string());
    
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

pub fn sync_media_to_db(db: &Connection, source: &str, media_type: &str, new_media_dirs: &Vec<MediaDir>) -> Result<(), String> {
    
    let existing_data = get_media_from_db(db, source, media_type)?;
    
    let mut all_media_dirs = if let Some(dirs) = existing_data {
        dirs
    } else {
        Vec::new()
    };

    let mut existing_paths: HashMap<String, usize> = HashMap::new();
    for (index, media_dir) in all_media_dirs.iter().enumerate() {
        existing_paths.insert(media_dir.path.clone(), index);
    }
    for new_media_dir in new_media_dirs {
        if let Some(index) = existing_paths.get(&new_media_dir.path) {
            all_media_dirs[*index] = new_media_dir.clone();
        } else {
            all_media_dirs.push(new_media_dir.clone());
        }
    }

    save_media_to_db(db, source, media_type, &all_media_dirs)
}

pub fn reset_media_cache_table_in_db(db: &Connection) -> Result<(), String> {
    db.execute("DROP TABLE IF EXISTS media_cache", []).map_err(|err| {
        logger::error!("RESET_MEDIA_CACHE_TABLE_FAILED", err);
        err.to_string()
    })?;
    create_media_table(db)?;
    Ok(())
}