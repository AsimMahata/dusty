use crate::dusty::{data::shows::ShowResult, logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{Connection, params};

pub fn create_show_cache_table(db:&Connection) ->Result<(),String>{
    db.execute("CREATE TABLE IF NOT EXISTS show_cache (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
    )",[]).map_err(|err|{
        logger::error!("CREATE_TABLE_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_to_show_cache_in_db(db:&Connection,id:String,data:String)->Result<(),String>{
    let id = get_sha256_id("show".to_string(),id.clone());
    db.execute("INSERT INTO show_cache (id, data) VALUES (?1, ?2)",params![id,data]).map_err(|err|{
        logger::error!("INSERT_INTO_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_from_show_cache_in_db(db:&Connection,id:String)->Result<Option<String>,String>{
    let id = get_sha256_id("show".to_string(),id);
    let mut stmt = db.prepare("SELECT data FROM show_cache WHERE id = ?1").map_err(|err|{
        logger::error!("PREPARE_GET_FROM_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    let result = stmt.query_row(params![id], |row| row.get(0));
    match result {
        Ok(data) => Ok(Some(data)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => {
            logger::error!("QUERY_GET_FROM_SHOW_CACHE_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn get_all_shows_from_show_cache_in_db(db:&Connection)->Result<Vec<ShowResult>,String>{
    let result:Result<String,rusqlite::Error> = db.query_row(
        "SELECT data FROM show_cache",
        params![],
        |row| {
            let data: String = row.get(0)?;
            Ok(data)
        },
    );

    match result {
        Ok(json_data) => {
            let shows: Vec<ShowResult> = serde_json::from_str(&json_data).map_err(|e| e.to_string())?;
            Ok(shows)
        },
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(Vec::new()),
        Err(err) => {
            logger::error!("GET_MEDIA_FROM_DB_FAILED", err);
            Err(err.to_string())
        }
    }
}


pub fn update_in_show_cache_in_db(db:&Connection,id:String,data:String)->Result<(),String>{
    let id = get_sha256_id("show".to_string(),id.clone());
    db.execute("UPDATE show_cache SET data = ?1 WHERE id = ?2",params![data,id]).map_err(|err|{
        logger::error!("UPDATE_IN_SHOW_CACHE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn reset_show_cache_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS show_cache", []).map_err(|err| {
        logger::error!("RESET_SHOW_CACHE_TABLE_FAILED", err);
        err.to_string()
    })?;
    create_show_cache_table(conn).map_err(|err| {
        logger::error!("RESET_MAL_CACHE_TABLE_CREATE_FAILED", err);
        err.to_string()
    })
}