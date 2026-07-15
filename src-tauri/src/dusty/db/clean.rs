use rusqlite::Connection;

pub fn delete_all_tables(conn: &Connection, tables: &Vec<String>) -> Result<(), String> {
    for table in tables {
        conn.execute(&format!("DROP TABLE IF EXISTS {}", table), [])
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
