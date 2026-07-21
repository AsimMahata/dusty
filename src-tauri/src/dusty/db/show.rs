use crate::dusty::{
    data::shows::{ShowInfo, ShowResult},
    db::show_cache::add_to_show_cache_in_db,
    logger::logger,
    utility::sha256_hash::get_sha256_id,
};
use rusqlite::{params, Connection, Result};

pub fn add_shows_in_db(db: &Connection, shows: &Vec<ShowResult>) -> Result<()> {
    for show in shows {
        add_show_in_db(db, show).ok();
        add_to_show_cache_in_db(db, show.id.clone(), serde_json::to_string(show).unwrap()).ok();
    }

    Ok(())
}

pub fn add_show_in_db(db: &Connection, show: &ShowResult) -> Result<(), String> {
    add_in_show_table(db, show).map_err(|err| err.to_string())?;

    Ok(())
}

fn add_in_show_table(db: &Connection, show: &ShowResult) -> Result<()> {
    db.execute(
        "
        INSERT INTO shows (id, title, dir, status, banned, pinned, mal_id, airing)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
        ",
        params![
            &show.id,
            &show.title,
            &show.dir,
            &show.status,
            &show.banned,
            &show.pinned,
            &show.mal_id,
            &show.airing
        ],
    )?;

    Ok(())
}

pub fn get_show_info(db: &Connection, id: &String) -> Result<ShowInfo, String> {
    db.query_row(
        "
        SELECT title, status, banned, pinned, mal_id, airing
        FROM shows
        WHERE id = ?1
        ",
        params![id],
        |row| {
            Ok(ShowInfo {
                title: row.get(0)?,
                status: row.get(1)?,
                banned: row.get(2)?,
                pinned: row.get(3)?,
                mal_id: row.get(4)?,
                airing: row.get(5)?,
            })
        },
    )
    .map_err(|err| {
        logger::error!("GET_SHOW_INFO_FAILED", err);
        err.to_string()
    })
}

pub fn print_all_shows_in_db(db: &Connection) -> Result<(), String> {
    let mut stmt = db
        .prepare("SELECT id, title, dir, status, banned, pinned, mal_id, airing FROM shows")
        .map_err(|err| {
            logger::error!("PREPARE_PRINT_SHOWS_FAILED", err);
            err.to_string()
        })?;

    let rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, bool>(4)?,
                row.get::<_, bool>(5)?,
                row.get::<_, Option<i32>>(6)?,
                row.get::<_, bool>(7)?,
            ))
        })
        .map_err(|err| {
            logger::error!("QUERY_PRINT_SHOWS_FAILED", err);
            err.to_string()
        })?;

    println!("=== Shows ===");

    for row in rows {
        let (id, title, dir, status, banned, pinned, mal_id, airing) = row.map_err(|err| {
            logger::error!("READ_PRINT_SHOWS_FAILED", err);
            err.to_string()
        })?;

        println!("ID        : {}", id);
        println!("Title     : {}", title);
        println!("Dir       : {}", dir);
        println!("Status    : {}", status);
        println!("Is Banned : {}", banned);
        println!("Is Pinned : {}", pinned);
        println!("Mal ID    : {:?}", mal_id);
        println!("Airing    : {}", airing);
        println!("-------------------------");
    }

    Ok(())
}

pub fn create_shows_table(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS shows (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            dir TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'default',
            banned INTEGER NOT NULL DEFAULT 0,
            pinned INTEGER NOT NULL DEFAULT 0,
            mal_id INTEGER DEFAULT NULL,
            airing INTEGER NOT NULL DEFAULT 0
        )
        ",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_SHOWS_TABLE_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn update_mal_id_in_db(db: &Connection, id: String, mal_id: i32) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET mal_id = ?1 WHERE id = ?2",
        params![mal_id, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_MAL_ID_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn rename_show_in_db(db: &Connection, id: String, new_name: String) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET title = ?1 WHERE id = ?2",
        params![new_name, id],
    )
    .map_err(|err| {
        logger::error!("RENAME_SHOW_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn update_show_status_in_db(
    db: &Connection,
    id: String,
    new_status: String,
) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET status = ?1 WHERE id = ?2",
        params![new_status, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_SHOW_STATUS_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn update_ban_status_in_db(
    db: &Connection,
    id: String,
    new_ban_status: bool,
) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET banned = ?1 WHERE id = ?2",
        params![new_ban_status, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_BAN_STATUS_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn update_pin_status_in_db(
    db: &Connection,
    id: String,
    new_pin_status: bool,
) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET pinned = ?1 WHERE id = ?2",
        params![new_pin_status, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_PIN_STATUS_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn reset_show_table_in_db(conn: &Connection) -> Result<(), String> {
    conn.execute("DROP TABLE IF EXISTS shows", [])
        .map_err(|err| {
            logger::error!("RESET_SHOWS_TABLE_FAILED", err);
            err.to_string()
        })?;
    create_shows_table(conn).map_err(|err| {
        logger::error!("RESET_SHOWS_TABLE_CREATE_FAILED", err);
        err.to_string()
    })
}
