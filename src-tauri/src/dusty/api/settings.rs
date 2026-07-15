use crate::dusty::data::state::AppState;
use crate::dusty::db::clean::delete_all_tables;
use crate::dusty::db::init::initialize_tables;
use crate::dusty::logger::logger;
use tauri::State;

#[tauri::command]
pub fn reset_database(state: State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let tables = state.tables.clone();
    delete_all_tables(&db, &tables)?;
    initialize_tables(&db)?;
    logger::info!("Database has been reset successfully.", "");
    Ok(())
}
