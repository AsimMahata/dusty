use rusqlite::{params, Connection};

pub fn create_ban_table(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS bans (
            id TEXT PRIMARY KEY
        )
        ",
        [],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn ban_bad_item(conn: &Connection, id: String) -> Result<(), String> {
    conn.execute("INSERT INTO bans (id) VALUES (?1)", params![id])
        .map_err(|e| format!("Failed to insert ban: {}", e))?;
    Ok(())
}
pub fn unban_bad_item(conn: &Connection, id: String) -> Result<(), String> {
    conn.execute("DELETE FROM bans WHERE id = ?1", params![id])
        .map_err(|e| format!("Failed to delete ban: {}", e))?;
    Ok(())
}

pub fn is_banned(conn: &Connection, id: String) -> bool {
    let mut stmt = match conn.prepare("SELECT 1 FROM bans WHERE id = ?1") {
        Ok(stmt) => stmt,
        Err(e) => {
            eprintln!("Failed to prepare query: {}", e);
            return false;
        }
    };

    let mut rows = match stmt.query(params![id]) {
        Ok(rows) => rows,
        Err(e) => {
            eprintln!("Failed to query bans: {}", e);
            return false;
        }
    };

    match rows.next() {
        Ok(Some(_)) => true,
        Ok(None) => false,
        Err(e) => {
            eprintln!("Failed to read query result: {}", e);
            false
        }
    }
}

pub fn print_all_banned_items(conn: &Connection) -> Result<(), String> {
    let mut stmt = conn
        .prepare("SELECT id FROM bans")
        .map_err(|e| format!("Failed to prepare query: {}", e))?;

    let rows = stmt
        .query_map([], |row| row.get::<_, String>(0))
        .map_err(|e| format!("Failed to query bans: {}", e))?;

    println!("=== Banned Items ===");

    for row in rows {
        let id = row.map_err(|e| format!("Failed to read row: {}", e))?;
        println!("{}", id);
    }

    Ok(())
}
