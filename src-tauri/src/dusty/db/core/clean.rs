use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use rusqlite::Connection;

pub fn delete_all_tables(conn: &Connection, tables: &Vec<String>) -> Result<()> {
    for table in tables {
        conn.execute(&format!("DROP TABLE IF EXISTS {}", table), [])
            .map_err(|e| DustyError::db("drop_table", Some(table.clone()), e))?;
    }

    Ok(())
}
