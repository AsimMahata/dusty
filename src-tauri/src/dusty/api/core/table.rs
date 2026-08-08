use crate::dusty::data::state::AppState;
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn get_all_tables(state: tauri::State<AppState>) -> Result<Vec<String>, String> {
    let tables = state.tables.clone();
    Ok(tables)
}

#[tauri::command]
pub fn reset_table(state: tauri::State<AppState>, table_name: String) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_table");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    let query = format!("DROP TABLE IF EXISTS {}", table_name);
    db.execute(&query, []).map_err(|e| {
        let err = DustyError::db("drop_table", Some(table_name.clone()), e);
        logger::error!("FAILED_TO_DROP_TABLE", err.log_details());
        err.to_user_message()
    })?;

    if let Err(err) = crate::dusty::db::core::initialize_tables(&db) {
        logger::error!("INITIALIZE_TABLES_FAILED", err.log_details());
        return Err(err.to_user_message());
    }

    logger::info!("RESET_TABLE_SUCCESS", table_name);
    Ok(())
}

#[tauri::command]
pub fn resync_table(_state: tauri::State<AppState>, table_name: String) -> Result<(), String> {
    logger::warning!("NOT IMPLEMENTED: resync_table", table_name);
    Ok(())
}
