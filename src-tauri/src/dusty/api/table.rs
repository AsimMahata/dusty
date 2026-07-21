use crate::dusty::data::state::AppState;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn get_all_tables(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let tables = state.tables.clone();
    Ok(tables)
}

#[tauri::command]
pub fn reset_table(state: tauri::State<AppState>, table_name: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    // Use DROP TABLE to wipe data AND clear old schemas
    let query = format!("DROP TABLE IF EXISTS {}", table_name);
    db.execute(&query, []).map_err(|e| {
        logger::error!(
            "FAILED_TO_DROP_TABLE",
            format!("Table: {}, Error: {}", table_name, e)
        );
        e.to_string()
    })?;
    
    // Recreate the table with its latest schema
    let _ = crate::dusty::db::init::initialize_tables(&db);

    logger::info!("RESET_TABLE_SUCCESS", table_name);
    Ok(())
}

#[tauri::command]
pub fn resync_table(_state: tauri::State<AppState>, table_name: String) -> Result<(), String> {
    logger::warning!("NOT IMPLEMENTED: resync_table", table_name);
    Ok(())
}
