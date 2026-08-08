use crate::dusty::{
    data::shows::{ShowInfo, ShowResult, ShowType},
    error::{DustyError, Result},
    utility::sha256_hash::get_sha256_id,
};
use rusqlite::{params, Connection};

pub fn add_shows_in_db(db: &Connection, shows: &Vec<ShowResult>) -> Result<()> {
    for show in shows {
        add_show_in_db(db, show)?;
    }
    Ok(())
}

pub fn add_show_in_db(db: &Connection, show: &ShowResult) -> Result<()> {
    add_in_show_table(db, show)
}

fn add_in_show_table(db: &Connection, show: &ShowResult) -> Result<()> {
    let id = get_sha256_id("SHOW".to_string(), show.title.clone());
    db.execute(
        "
        INSERT OR IGNORE INTO shows (id, title, dir, status, banned, pinned, provider, provider_id, airing, show_type, season)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        ",
        params![
            &id,
            &show.title,
            &show.dir,
            &show.status,
            &show.banned,
            &show.pinned,
            &show.provider,
            &show.provider_id,
            &show.airing,
            show.show_type.as_str(),
            &show.season
        ],
    )
    .map_err(|err| DustyError::db("add_in_show_table", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn get_show_info(db: &Connection, id: &String) -> Result<ShowInfo> {
    db.query_row(
        "
        SELECT title, status, banned, pinned, provider, provider_id, airing, show_type
        FROM shows
        WHERE id = ?1
        ",
        params![id],
        |row| {
            let provider: Option<String> = row.get(4)?;
            let provider_id: Option<String> = row.get(5)?;
            let show_type_str: String = row.get(7)?;
            Ok(ShowInfo {
                title: row.get(0)?,
                status: row.get(1)?,
                banned: row.get(2)?,
                pinned: row.get(3)?,
                provider,
                provider_id,
                airing: row.get(6)?,
                show_type: ShowType::from_str(&show_type_str),
            })
        },
    )
    .map_err(|err| DustyError::db("get_show_info", Some("shows".to_string()), err))
}

pub fn print_all_shows_in_db(db: &Connection) -> Result<()> {
    let mut stmt = db
        .prepare("SELECT id, title, dir, status, banned, pinned, provider, provider_id, airing, show_type FROM shows")
        .map_err(|err| DustyError::db("prepare_print_shows", Some("shows".to_string()), err))?;

    let rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, bool>(4)?,
                row.get::<_, bool>(5)?,
                row.get::<_, Option<String>>(6)?,
                row.get::<_, Option<String>>(7)?,
                row.get::<_, bool>(8)?,
                row.get::<_, String>(9)?,
            ))
        })
        .map_err(|err| DustyError::db("query_print_shows", Some("shows".to_string()), err))?;

    println!("=== Shows ===");
    for row in rows {
        let (id, title, dir, status, banned, pinned, provider, provider_id, airing, show_type) = row
            .map_err(|err| DustyError::db("read_print_shows_row", Some("shows".to_string()), err))?;

        println!("ID          : {}", id);
        println!("Title       : {}", title);
        println!("Dir         : {}", dir);
        println!("Status      : {}", status);
        println!("Is Banned   : {}", banned);
        println!("Is Pinned   : {}", pinned);
        println!("Provider    : {:?}", provider);
        println!("Provider ID : {:?}", provider_id);
        println!("Airing      : {}", airing);
        println!("Show Type   : {}", show_type);
        println!("-------------------------");
    }
    Ok(())
}

pub fn create_shows_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS shows (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            dir TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'default',
            banned INTEGER NOT NULL DEFAULT 0,
            pinned INTEGER NOT NULL DEFAULT 0,
            provider TEXT DEFAULT NULL,
            provider_id TEXT DEFAULT NULL,
            airing INTEGER NOT NULL DEFAULT 0,
            show_type TEXT NOT NULL DEFAULT 'unknown',
            season INTEGER DEFAULT NULL,
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
        ",
        [],
    )
    .map_err(|err| DustyError::db("create_shows_table", Some("shows".to_string()), err))?;

    use crate::dusty::db::core::init::ensure_column_exists;
    ensure_column_exists(conn, "shows", "provider", "TEXT DEFAULT NULL")?;
    ensure_column_exists(conn, "shows", "provider_id", "TEXT DEFAULT NULL")?;
    ensure_column_exists(conn, "shows", "airing", "INTEGER NOT NULL DEFAULT 0")?;
    ensure_column_exists(conn, "shows", "show_type", "TEXT NOT NULL DEFAULT 'unknown'")?;
    ensure_column_exists(conn, "shows", "season", "INTEGER DEFAULT NULL")?;
    ensure_column_exists(conn, "shows", "created_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;
    ensure_column_exists(conn, "shows", "updated_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;

    Ok(())
}

pub fn update_show_provider_in_db(
    db: &Connection,
    id: String,
    provider: String,
    provider_id: String,
    show_type: Option<String>,
) -> Result<()> {
    let res = if let Some(st) = show_type {
        db.execute(
            "UPDATE shows SET provider = ?1, provider_id = ?2, show_type = ?3, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?4",
            params![provider, provider_id, st, id],
        )
    } else {
        db.execute(
            "UPDATE shows SET provider = ?1, provider_id = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?3",
            params![provider, provider_id, id],
        )
    };
    res.map_err(|err| DustyError::db("update_show_provider", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn rename_show_in_db(db: &Connection, id: String, new_name: String) -> Result<()> {
    db.execute(
        "UPDATE shows SET title = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
        params![new_name, id],
    )
    .map_err(|err| DustyError::db("rename_show", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn update_show_status_in_db(
    db: &Connection,
    id: String,
    new_status: String,
) -> Result<()> {
    db.execute(
        "UPDATE shows SET status = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
        params![new_status, id],
    )
    .map_err(|err| DustyError::db("update_show_status", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn update_ban_status_in_db(
    db: &Connection,
    id: String,
    new_ban_status: bool,
) -> Result<()> {
    db.execute(
        "UPDATE shows SET banned = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
        params![new_ban_status, id],
    )
    .map_err(|err| DustyError::db("update_ban_status", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn update_pin_status_in_db(
    db: &Connection,
    id: String,
    new_pin_status: bool,
) -> Result<()> {
    db.execute(
        "UPDATE shows SET pinned = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
        params![new_pin_status, id],
    )
    .map_err(|err| DustyError::db("update_pin_status", Some("shows".to_string()), err))?;
    Ok(())
}

pub fn reset_show_table_in_db(conn: &Connection) -> Result<()> {
    conn.execute("DROP TABLE IF EXISTS shows", [])
        .map_err(|err| DustyError::db("reset_show_table_drop", Some("shows".to_string()), err))?;
    create_shows_table(conn)
}
