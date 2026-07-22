use crate::dusty::{data::zip::ZipDir, logger::logger};
use rusqlite::{params, Connection};

pub fn create_zip_dir_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS zip_dir_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_ZIP_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn save_zip_dir_cache(db: &Connection, dirs: &Vec<ZipDir>) -> Result<(), String> {
    let id = "root_zip_tree";
    let data = serde_json::to_string(dirs).map_err(|err| err.to_string())?;
    db.execute(
        "INSERT OR REPLACE INTO zip_dir_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| {
        logger::error!("SAVE_ZIP_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_zip_dir_cache(db: &Connection) -> Result<Vec<ZipDir>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM zip_dir_cache WHERE id = ?1")
        .map_err(|err| err.to_string())?;

    let mut rows = stmt
        .query(params!["root_zip_tree"])
        .map_err(|err| {
            logger::error!("GET_ZIP_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;

    if let Ok(Some(row)) = rows.next() {
        let json_data: String = row.get(0).map_err(|err| err.to_string())?;
        if let Ok(dirs) = serde_json::from_str::<Vec<ZipDir>>(&json_data) {
            return Ok(dirs);
        }
    }

    Ok(Vec::new())
}

pub fn reset_zip_dir_cache(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS zip_dir_cache", [])
        .map_err(|err| {
            logger::error!("RESET_ZIP_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;
    create_zip_dir_cache_table(conn)
}
