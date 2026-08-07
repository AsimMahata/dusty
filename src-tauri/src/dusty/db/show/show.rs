use crate::dusty::{
    data::shows::{ShowInfo, ShowResult, ShowType},
    logger::logger,
    utility::sha256_hash::get_sha256_id,
};
use rusqlite::{params, Connection, Result};

pub fn add_shows_in_db(db: &Connection, shows: &Vec<ShowResult>) -> Result<()> {
    for show in shows {
        add_show_in_db(db, show).ok();
    }
    Ok(())
}

pub fn add_show_in_db(db: &Connection, show: &ShowResult) -> Result<(), String> {
    add_in_show_table(db, show).map_err(|err| err.to_string())?;
    Ok(())
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
    )?;
    Ok(())
}

pub fn get_show_info(db: &Connection, id: &String) -> Result<ShowInfo, String> {
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
    .map_err(|err| {
        logger::error!("GET_SHOW_INFO_FAILED", err);
        err.to_string()
    })
}

pub fn print_all_shows_in_db(db: &Connection) -> Result<(), String> {
    let mut stmt = db
        .prepare("SELECT id, title, dir, status, banned, pinned, provider, provider_id, airing, show_type FROM shows")
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
                row.get::<_, Option<String>>(6)?,
                row.get::<_, Option<String>>(7)?,
                row.get::<_, bool>(8)?,
                row.get::<_, String>(9)?,
            ))
        })
        .map_err(|err| {
            logger::error!("QUERY_PRINT_SHOWS_FAILED", err);
            err.to_string()
        })?;

    println!("=== Shows ===");
    for row in rows {
        let (id, title, dir, status, banned, pinned, provider, provider_id, airing, show_type) = row.map_err(|err| {
            logger::error!("READ_PRINT_SHOWS_FAILED", err);
            err.to_string()
        })?;

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
    .map_err(|err| {
        logger::error!("CREATE_SHOWS_TABLE_FAILED", err);
        err.to_string()
    })?;

    // Migration logic
    let _ = conn.execute("ALTER TABLE shows ADD COLUMN provider TEXT DEFAULT NULL;", []);
    let _ = conn.execute("ALTER TABLE shows ADD COLUMN provider_id TEXT DEFAULT NULL;", []);
    let _ = conn.execute("ALTER TABLE shows ADD COLUMN season INTEGER DEFAULT NULL;", []);
    let _ = conn.execute("ALTER TABLE shows ADD COLUMN created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));", []);
    let _ = conn.execute("ALTER TABLE shows ADD COLUMN updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'));", []);

    // If migrating from older DB: map show_id into provider & provider_id
    // First check if show_id column exists
    let has_show_id: bool = conn.query_row(
        "SELECT COUNT(*) FROM pragma_table_info('shows') WHERE name='show_id'",
        [],
        |row| row.get(0),
    ).unwrap_or(0) > 0;

    if has_show_id {
        // anime mapping: MAL ID
        let _ = conn.execute(
            "UPDATE shows SET 
                provider = 'mal', 
                provider_id = show_id,
                show_type = 'anime'
             WHERE provider IS NULL AND show_id IS NOT NULL AND show_type = 'anime';", 
            []
        );

        // tv_show / movie mapping: TMDB ID
        let _ = conn.execute(
            "UPDATE shows SET 
                provider = 'tmdb', 
                provider_id = show_id,
                show_type = 'movie_tv'
             WHERE provider IS NULL AND show_id IS NOT NULL AND (show_type = 'tv_show' OR show_type = 'movie');", 
            []
        );

        // Drop show_id column
        let _ = conn.execute("ALTER TABLE shows DROP COLUMN show_id;", []);
    }

    // Remap any old show_type values
    let _ = conn.execute("UPDATE shows SET show_type = 'movie_tv' WHERE show_type = 'tv_show' OR show_type = 'movie';", []);
    let _ = conn.execute("UPDATE shows SET show_type = 'anime' WHERE show_type = 'anime';", []);

    // Drop old columns if they exist
    let _ = conn.execute("ALTER TABLE shows DROP COLUMN mal_id;", []);

    Ok(())
}

pub fn update_show_provider_in_db(
    db: &Connection,
    id: String,
    provider: String,
    provider_id: String,
    show_type: Option<String>,
) -> Result<(), String> {
    if let Some(st) = show_type {
        db.execute(
            "UPDATE shows SET provider = ?1, provider_id = ?2, show_type = ?3, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?4",
            params![provider, provider_id, st, id],
        )
    } else {
        db.execute(
            "UPDATE shows SET provider = ?1, provider_id = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?3",
            params![provider, provider_id, id],
        )
    }
    .map_err(|err| {
        logger::error!("UPDATE_SHOW_PROVIDER_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn rename_show_in_db(db: &Connection, id: String, new_name: String) -> Result<(), String> {
    db.execute(
        "UPDATE shows SET title = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
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
        "UPDATE shows SET status = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
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
        "UPDATE shows SET banned = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
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
        "UPDATE shows SET pinned = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ?2",
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
