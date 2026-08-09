use crate::dusty::{
    models::file::FileInfo,
    error::{DustyError, Result},
};
use rusqlite::{params, Connection};

pub fn create_misc_cache_table(db: &Connection) -> Result<()> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS misc_cache (
        id TEXT NOT NULL,
        misc_type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        PRIMARY KEY (id, misc_type)
    )",
        [],
    )
    .map_err(|err| DustyError::db("create_misc_cache_table", Some("misc_cache".to_string()), err))?;
    Ok(())
}

pub fn add_or_update_misc_cache(db: &Connection, file: &FileInfo, misc_type: &str) -> Result<()> {
    let id = file.id.clone();
    let data = serde_json::to_string(file)
        .map_err(|e| DustyError::serde("serialize_file_info", e))?;

    db.execute(
        "INSERT OR REPLACE INTO misc_cache (id, misc_type, data) VALUES (?1, ?2, ?3)",
        params![id, misc_type, data],
    )
    .map_err(|err| DustyError::db("add_or_update_misc_cache", Some("misc_cache".to_string()), err))?;
    Ok(())
}

pub fn get_misc_cache(db: &Connection, misc_type: &str) -> Result<Vec<FileInfo>> {
    let mut stmt = db
        .prepare("SELECT data FROM misc_cache WHERE misc_type = ?1")
        .map_err(|err| DustyError::db("prepare_get_misc_cache", Some("misc_cache".to_string()), err))?;

    let file_iter = stmt
        .query_map(params![misc_type], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|err| DustyError::db("query_get_misc_cache", Some("misc_cache".to_string()), err))?;

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

pub fn reset_misc_cache(conn: &Connection, misc_type: &str) -> Result<()> {
    conn.execute("DELETE FROM misc_cache WHERE misc_type = ?1", params![misc_type])
        .map_err(|err| DustyError::db("reset_misc_cache", Some("misc_cache".to_string()), err))?;
    Ok(())
}
