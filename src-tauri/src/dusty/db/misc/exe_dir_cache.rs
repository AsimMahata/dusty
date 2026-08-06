use crate::dusty::{data::exe::ExecutableDir, logger::logger};
use rusqlite::{params, Connection};

pub fn create_exe_dir_cache_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS exe_dir_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_EXE_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn save_exe_dir_cache(db: &Connection, dirs: &Vec<ExecutableDir>) -> Result<(), String> {
    let id = "root_exe_tree";
    let data = serde_json::to_string(dirs).map_err(|err| err.to_string())?;
    db.execute(
        "INSERT OR REPLACE INTO exe_dir_cache (id, data) VALUES (?1, ?2)",
        params![id, data],
    )
    .map_err(|err| {
        logger::error!("SAVE_EXE_DIR_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_exe_dir_cache(db: &Connection) -> Result<Vec<ExecutableDir>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM exe_dir_cache WHERE id = ?1")
        .map_err(|err| err.to_string())?;

    let mut rows = stmt
        .query(params!["root_exe_tree"])
        .map_err(|err| {
            logger::error!("GET_EXE_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;

    if let Ok(Some(row)) = rows.next() {
        let json_data: String = row.get(0).map_err(|err| err.to_string())?;
        if let Ok(dirs) = serde_json::from_str::<Vec<ExecutableDir>>(&json_data) {
            return Ok(dirs);
        }
    }

    Ok(Vec::new())
}

pub fn reset_exe_dir_cache(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS exe_dir_cache", [])
        .map_err(|err| {
            logger::error!("RESET_EXE_DIR_CACHE_FAILED", err);
            err.to_string()
        })?;
    create_exe_dir_cache_table(conn)
}
