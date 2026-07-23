use crate::dusty::{data::file::FileInfo, logger::logger};
use rusqlite::{params, Connection};

pub fn create_misc_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS misc_cache (
        id TEXT NOT NULL,
        misc_type TEXT NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (id, misc_type)
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_MISC_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_or_update_misc_cache(db: &Connection, file: &FileInfo, misc_type: &str) -> Result<(), String> {
    let id = file.id.clone();
    let data = serde_json::to_string(file).map_err(|err| {
        logger::error!("SERIALIZE_FILE_INFO_FAILED", err);
        err.to_string()
    })?;
    
    db.execute(
        "INSERT OR REPLACE INTO misc_cache (id, misc_type, data) VALUES (?1, ?2, ?3)",
        params![id, misc_type, data],
    )
    .map_err(|err| {
        logger::error!("INSERT_OR_REPLACE_MISC_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_misc_cache(db: &Connection, misc_type: &str) -> Result<Vec<FileInfo>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM misc_cache WHERE misc_type = ?1")
        .map_err(|err| err.to_string())?;

    let file_iter = stmt
        .query_map(params![misc_type], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|err| {
            logger::error!("GET_MISC_CACHE_FAILED", err);
            err.to_string()
        })?;

    let mut files = Vec::new();
    for data_result in file_iter {
        if let Ok(json_data) = data_result {
            if let Ok(file_info) = serde_json::from_str::<FileInfo>(&json_data) {
                files.push(file_info);
            } else {
                logger::error!(
                    "PARSE_FILE_INFO_FAILED",
                    "Failed to parse a row in misc_cache"
                );
            }
        }
    }

    Ok(files)
}

pub fn reset_misc_cache(conn: &Connection, misc_type: &str) -> Result<(), String> {
    conn.execute("DELETE FROM misc_cache WHERE misc_type = ?1", params![misc_type])
        .map_err(|err| {
            logger::error!("RESET_MISC_CACHE_FAILED", err);
            err.to_string()
        })?;
    Ok(())
}
