use crate::dusty::{
    models::file::FileInfo,
    error::{DustyError, Result},
};
use rusqlite::{params, Connection};

pub fn create_empty_dir_cache_table(db: &Connection) -> Result<()> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS empty_dir_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )",
        [],
    )
    .map_err(|err| DustyError::db("create_empty_dir_cache_table", Some("empty_dir_cache".to_string()), err))?;
    Ok(())
}

pub fn add_or_update_empty_dir_cache(db: &Connection, file: &FileInfo) -> Result<()> {
    let id = file.id.clone();
    let data = serde_json::to_string(file)
        .map_err(|e| DustyError::serde("serialize_empty_dir", e))?;

    db.execute(
        "INSERT OR REPLACE INTO empty_dir_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| DustyError::db("add_or_update_empty_dir_cache", Some("empty_dir_cache".to_string()), err))?;
    Ok(())
}

pub fn get_empty_dir_cache(db: &Connection) -> Result<Vec<FileInfo>> {
    let mut stmt = db
        .prepare("SELECT data FROM empty_dir_cache")
        .map_err(|err| DustyError::db("prepare_get_empty_dir_cache", Some("empty_dir_cache".to_string()), err))?;

    let file_iter = stmt
        .query_map([], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|err| DustyError::db("query_get_empty_dir_cache", Some("empty_dir_cache".to_string()), err))?;

    let mut files = Vec::new();
    for data_result in file_iter {
        if let Ok(json_data) = data_result {
            if let Ok(file_info) = serde_json::from_str::<FileInfo>(&json_data) {
                files.push(file_info);
            }
        }
    }

    Ok(files)
}

pub fn reset_empty_dir_cache(conn: &Connection) -> Result<()> {
    conn.execute("DROP TABLE IF EXISTS empty_dir_cache", [])
        .map_err(|err| DustyError::db("reset_empty_dir_cache_drop", Some("empty_dir_cache".to_string()), err))?;
    create_empty_dir_cache_table(conn)
}
