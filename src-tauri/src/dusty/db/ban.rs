use crate::dusty::logger::logger;
use rusqlite::{params, Connection};

pub fn ban_show_in_db(conn: &Connection, id: String) -> Result<(), String> {
    conn.execute("UPDATE shows SET is_banned = 1 WHERE id = ?1", params![id])
        .map_err(|err| {
            logger::error!("BAN_SHOW_FAILED", err);
            err.to_string()
        })?;

    Ok(())
}

pub fn unban_show_in_db(conn: &Connection, id: String) -> Result<(), String> {
    conn.execute("UPDATE shows SET is_banned = 0 WHERE id = ?1", params![id])
        .map_err(|err| {
            logger::error!("UNBAN_SHOW_FAILED", err);
            err.to_string()
        })?;

    Ok(())
}

pub fn is_banned(conn: &Connection, id: String) -> Result<bool, String> {
    let is_banned = conn
        .query_row(
            "SELECT is_banned FROM shows WHERE id = ?1",
            params![id],
            |row| row.get::<_, bool>(0),
        )
        .map_err(|err| {
            logger::error!("GET_BANNED_STATUS_FAILED", err);
            err.to_string()
        })?;

    Ok(is_banned)
}

pub fn print_all_banned_shows(conn: &Connection) -> Result<(), String> {
    let mut stmt = conn
        .prepare("SELECT id, title FROM shows WHERE is_banned = 1")
        .map_err(|err| {
            logger::error!("PREPARE_PRINT_BANNED_SHOWS_FAILED", err);
            err.to_string()
        })?;

    let rows = stmt
        .query_map([], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?))
        })
        .map_err(|err| {
            logger::error!("QUERY_PRINT_BANNED_SHOWS_FAILED", err);
            err.to_string()
        })?;

    println!("=== Banned Shows ===");

    for row in rows {
        let (id, title) = row.map_err(|err| {
            logger::error!("READ_PRINT_BANNED_SHOWS_FAILED", err);
            err.to_string()
        })?;

        println!("{} - {}", id, title);
    }

    Ok(())
}
