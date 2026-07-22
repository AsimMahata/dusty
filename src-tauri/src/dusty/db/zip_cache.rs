use crate::dusty::{data::file::FileInfo, logger::logger};
use rusqlite::{params, Connection};

pub fn create_zip_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS zip_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_ZIP_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_or_update_zip_cache(db: &Connection, file: &FileInfo) -> Result<(), String> {
    let id = file.id.clone();
    let data = serde_json::to_string(file).map_err(|err| {
        logger::error!("SERIALIZE_FILE_INFO_FAILED", err);
        err.to_string()
    })?;
    
    db.execute(
        "INSERT OR REPLACE INTO zip_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| {
        logger::error!("INSERT_OR_REPLACE_ZIP_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_zip_cache(db: &Connection) -> Result<Vec<FileInfo>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM zip_cache")
        .map_err(|err| err.to_string())?;

    let file_iter = stmt
        .query_map([], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|err| {
            logger::error!("GET_ZIP_CACHE_FAILED", err);
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
                    "Failed to parse a row in zip_cache"
                );
            }
        }
    }

    Ok(files)
}

pub fn reset_zip_cache(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS zip_cache", [])
        .map_err(|err| {
            logger::error!("RESET_ZIP_CACHE_FAILED", err);
            err.to_string()
        })?;
    create_zip_cache_table(conn)
}
