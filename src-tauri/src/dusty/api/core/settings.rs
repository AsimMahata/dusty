use crate::dusty::data::state::AppState;
use crate::dusty::db::core::{delete_all_tables, initialize_tables};
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;
use tauri::{Manager, State};

#[tauri::command]
pub fn reset_database(app_handle: tauri::AppHandle, state: State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("reset_database");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;

    let tables = state.tables.clone();
    delete_all_tables(&db, &tables).map_err(|e| {
        logger::error!("DELETE_ALL_TABLES_FAILED", e.log_details());
        e.to_user_message()
    })?;

    initialize_tables(&db).map_err(|e| {
        logger::error!("INITIALIZE_TABLES_FAILED", e.log_details());
        e.to_user_message()
    })?;

    if let Ok(home_dir) = app_handle.path().home_dir() {
        let dusty_dir = home_dir.join(".dusty");
        if dusty_dir.exists() {
            if let Err(e) = std::fs::remove_dir_all(&dusty_dir) {
                let err = DustyError::io("clean_dusty_dir", &dusty_dir, e);
                logger::error!("CLEAN_DUSTY_DIR_FAILED", err.log_details());
            } else {
                logger::info!("Cleaned ~/.dusty directory successfully.", "");
            }
        }
    }

    logger::info!("Database and ~/.dusty directory have been reset successfully.", "");
    Ok(())
}
