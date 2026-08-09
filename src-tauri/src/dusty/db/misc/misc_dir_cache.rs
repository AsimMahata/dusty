use crate::dusty::{
    models::misc_dir::MiscDir,
    error::{DustyError, Result},
};
use rusqlite::{params, Connection};

pub fn create_misc_dir_cache_table(db: &Connection) -> Result<()> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS misc_dir_cache (
        id TEXT NOT NULL,
        misc_type TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        PRIMARY KEY (id, misc_type)
    )",
        [],
    )
    .map_err(|err| DustyError::db("create_misc_dir_cache_table", Some("misc_dir_cache".to_string()), err))?;
    Ok(())
}

pub fn save_misc_dir_cache(db: &Connection, dirs: &Vec<MiscDir>, misc_type: &str) -> Result<()> {
    let id = format!("root_{}_tree", misc_type);
    let data = serde_json::to_string(dirs)
        .map_err(|e| DustyError::serde("serialize_misc_dir_cache", e))?;
    db.execute(
        "INSERT OR REPLACE INTO misc_dir_cache (id, misc_type, data) VALUES (?1, ?2, ?3)",
        params![id, misc_type, data],
    )
    .map_err(|err| DustyError::db("save_misc_dir_cache", Some("misc_dir_cache".to_string()), err))?;
    Ok(())
}

pub fn get_misc_dir_cache(db: &Connection, misc_type: &str) -> Result<Vec<MiscDir>> {
    let id = format!("root_{}_tree", misc_type);
    let mut stmt = db
        .prepare("SELECT data FROM misc_dir_cache WHERE id = ?1 AND misc_type = ?2")
        .map_err(|err| DustyError::db("prepare_get_misc_dir_cache", Some("misc_dir_cache".to_string()), err))?;

    let mut rows = stmt
        .query(params![id, misc_type])
        .map_err(|err| DustyError::db("query_get_misc_dir_cache", Some("misc_dir_cache".to_string()), err))?;

    if let Ok(Some(row)) = rows.next() {
        let json_data: String = row.get(0)
            .map_err(|err| DustyError::db("read_row_misc_dir_cache", Some("misc_dir_cache".to_string()), err))?;
        if let Ok(dirs) = serde_json::from_str::<Vec<MiscDir>>(&json_data) {
            return Ok(dirs);
        }
    }

    Ok(Vec::new())
}

pub fn reset_misc_dir_cache(conn: &Connection, misc_type: &str) -> Result<()> {
    let id = format!("root_{}_tree", misc_type);
    conn.execute("DELETE FROM misc_dir_cache WHERE id = ?1 AND misc_type = ?2", params![id, misc_type])
        .map_err(|err| DustyError::db("reset_misc_dir_cache", Some("misc_dir_cache".to_string()), err))?;
    Ok(())
}
