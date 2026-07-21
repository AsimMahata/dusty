use crate::dusty::{logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{params, Connection};

pub fn create_anime_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "CREATE TABLE IF NOT EXISTS anime (
        id TEXT NOT NULL PRIMARY KEY,
        mal_id INTEGER,
        title TEXT NOT NULL,
        num_episodes INTEGER,
        season INTEGER,
        airing BOOLEAN DEFAULT 0
    )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_TABLE_ANIME_FAILED", err);
        err.to_string()
    })?;
    let _ = db.execute("ALTER TABLE anime ADD COLUMN airing BOOLEAN DEFAULT 0", []);
    Ok(())
}

pub fn add_to_anime_in_db(
    db: &Connection,
    mal_id: i32,
    title: String,
    num_episodes: Option<u32>,
    season: Option<i32>,
    airing: bool,
) -> Result<(), String> {
    let anime_id = get_sha256_id(title.clone(), mal_id.to_string());
    db.execute(
        "INSERT INTO anime (id, mal_id, title, num_episodes, season, airing) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![anime_id, mal_id, title, num_episodes, season, airing],
    )
    .map_err(|err| {
        err.to_string()
    })?;
    Ok(())
}

pub fn get_all_anime_titles_in_db(db: &Connection) -> Result<Vec<Anime>, String> {
    let mut stmt = db
        .prepare("SELECT mal_id, title, num_episodes, season, airing FROM anime")
        .map_err(|err| {
            logger::error!("GET_ALL_ANIME_TITLES_FAILED", err);
            err.to_string()
        })?;

    let anime_iter = stmt
        .query_map([], |row| {
            Ok(Anime {
                mal_id: row.get(0)?,
                title: row.get(1)?,
                num_episodes: row.get(2)?,
                season: row.get(3)?,
                airing: row.get(4).unwrap_or(false),
            })
        })
        .map_err(|err| {
            logger::error!("GET_ALL_ANIME_TITLES_FAILED", err);
            err.to_string()
        })?;

    let mut titles = Vec::new();
    for anime_result in anime_iter {
        match anime_result {
            Ok(anime) => titles.push(anime),
            Err(e) => {
                logger::error!("GET_ALL_ANIME_TITLES_FAILED", e);
            }
        }
    }
    Ok(titles)
}

pub fn reset_anime_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS anime", [])
        .map_err(|err| {
            logger::error!("RESET_ANIME_TABLE_FAILED", err);
            err.to_string()
        })?;
    create_anime_table(conn).map_err(|err| {
        logger::error!("RESET_ANIME_TABLE_CREATE_FAILED", err);
        err.to_string()
    })
}

pub struct Anime {
    pub title: String,
    pub mal_id: i32,
    pub num_episodes: Option<usize>,
    pub season: Option<i32>,
    pub airing: bool,
}
