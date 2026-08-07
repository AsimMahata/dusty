use crate::dusty::{logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{params, Connection};

pub fn create_tv_show_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS tv_show (
        id TEXT NOT NULL PRIMARY KEY,
        imdb_id TEXT NOT NULL,
        title TEXT NOT NULL,
        year INTEGER,
        image_url TEXT
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_TV_SHOW_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn add_to_tv_show_in_db(
    db: &Connection,
    imdb_id: String,
    title: String,
    year: Option<i32>,
    image_url: Option<String>,
) -> Result<(), String> {
    let tv_show_id = get_sha256_id(title.clone(), imdb_id.clone());
    db.execute(
        "INSERT OR REPLACE INTO tv_show (id, imdb_id, title, year, image_url) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![tv_show_id, imdb_id, title, year, image_url],
    )
    .map_err(|err| {
        err.to_string()
    })?;
    Ok(())
}

pub fn get_all_tv_show_titles_in_db(db: &Connection) -> Result<Vec<TvShow>, String> {
    let mut stmt = db
        .prepare("SELECT imdb_id, title, year, image_url FROM tv_show")
        .map_err(|err| {
            logger::error!("GET_ALL_TV_SHOW_TITLES_FAILED", err);
            err.to_string()
        })?;

    let tv_show_iter = stmt
        .query_map([], |row| {
            Ok(TvShow {
                imdb_id: row.get(0)?,
                title: row.get(1)?,
                year: row.get(2)?,
                image_url: row.get(3)?,
            })
        })
        .map_err(|err| {
            logger::error!("GET_ALL_TV_SHOW_TITLES_FAILED", err);
            err.to_string()
        })?;

    let mut titles = Vec::new();
    for tv_show_result in tv_show_iter {
        match tv_show_result {
            Ok(tv_show) => titles.push(tv_show),
            Err(e) => {
                logger::error!("GET_ALL_TV_SHOW_TITLES_FAILED", e);
            }
        }
    }
    Ok(titles)
}

pub fn reset_tv_show_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS tv_show", [])
        .map_err(|err| {
            logger::error!("RESET_TV_SHOW_TABLE_FAILED", err);
            err.to_string()
        })?;
    create_tv_show_table(conn).map_err(|err| {
        logger::error!("RESET_TV_SHOW_TABLE_CREATE_FAILED", err);
        err.to_string()
    })
}

pub struct TvShow {
    pub title: String,
    pub imdb_id: String,
    pub year: Option<i32>,
    pub image_url: Option<String>,
}
