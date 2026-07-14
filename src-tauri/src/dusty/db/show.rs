use crate::dusty::{data::shows::ShowResult, logger::logger, utility::sha256_hash::get_sha256_id};
use rusqlite::{params, Connection, Result};

pub fn add_shows_in_db(db: &mut Connection, shows: &Vec<ShowResult>) -> Result<()> {
    for show in shows {
        add_show_in_db(db, show)
            .map_err(|err| logger::error!("INSERT_SHOW_IN_DB_FAILED", err))
            .ok();
    }
    Ok(())
}
pub fn add_show_in_db(db: &mut Connection, show: &ShowResult) -> Result<()> {
    let sha256_hash: String = generate_sha256_for_show(show);
    add_in_show_table(db, sha256_hash, show)?;

    Ok(())
}

fn add_in_show_table(db: &mut Connection, id: String, show: &ShowResult) -> Result<()> {
    db.execute(
        "INSERT INTO shows (id, title, dir) VALUES (?1, ?2, ?3)",
        rusqlite::params![id, &show.title, &show.dir,],
    )?;
    Ok(())
}

fn generate_sha256_for_show(show: &ShowResult) -> String {
    get_sha256_id(show.dir.clone(), show.title.clone())
}

pub fn print_all_shows_in_db(db: &Connection) -> Result<(), String> {
    let mut stmt = db
        .prepare("SELECT id, title, dir FROM shows")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
            ))
        })
        .map_err(|e| e.to_string())?;

    println!("=== Shows ===");

    for row in rows {
        let (id, title, dir) = row.map_err(|e| e.to_string())?;
        println!("ID   : {}", id);
        println!("Title: {}", title);
        println!("Dir  : {}", dir);
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
            dir TEXT NOT NULL
        )
        ",
        [],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
