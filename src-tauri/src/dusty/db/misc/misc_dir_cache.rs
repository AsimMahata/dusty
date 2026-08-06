use crate::dusty::{data::misc_dir::MiscDir, logger::logger};
use rusqlite::{params, Connection};

pub fn create_misc_dir_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS misc_dir_cache (
        id TEXT NOT NULL,
        misc_type TEXT NOT NULL,
        data TEXT NOT NULL,
        PRIMARY KEY (id, misc_type)
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_MISC_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn save_misc_dir_cache(db: &Connection, dirs: &Vec<MiscDir>, misc_type: &str) -> Result<(), String> {
    let id = format!("root_{}_tree", misc_type);
    let data = serde_json::to_string(dirs).map_err(|err| err.to_string())?;
    db.execute(
        "INSERT OR REPLACE INTO misc_dir_cache (id, misc_type, data) VALUES (?1, ?2, ?3)",
        params![id, misc_type, data],
    )
    .map_err(|err| {
        logger::error!("SAVE_MISC_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_misc_dir_cache(db: &Connection, misc_type: &str) -> Result<Vec<MiscDir>, String> {
    let id = format!("root_{}_tree", misc_type);
    let mut stmt = db
        .prepare("SELECT data FROM misc_dir_cache WHERE id = ?1 AND misc_type = ?2")
        .map_err(|err| err.to_string())?;

    let mut rows = stmt
        .query(params![id, misc_type])
        .map_err(|err| {
            logger::error!("GET_MISC_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;

    if let Ok(Some(row)) = rows.next() {
        let json_data: String = row.get(0).map_err(|err| err.to_string())?;
        if let Ok(dirs) = serde_json::from_str::<Vec<MiscDir>>(&json_data) {
            return Ok(dirs);
        }
    }

    Ok(Vec::new())
}

pub fn reset_misc_dir_cache(conn: &Connection, misc_type: &str) -> Result<(), String> {
    let id = format!("root_{}_tree", misc_type);
    conn.execute("DELETE FROM misc_dir_cache WHERE id = ?1 AND misc_type = ?2", params![id, misc_type])
        .map_err(|err| {
            logger::error!("RESET_MISC_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;
    Ok(())
}
