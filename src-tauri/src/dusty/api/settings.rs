use crate::dusty::data::state::AppState;
use tauri::State;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn reset_database(state: State<AppState>) -> Result<(), String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    
    db.execute("DELETE FROM shows", []).map_err(|e| e.to_string())?;
    db.execute("DELETE FROM bans", []).map_err(|e| e.to_string())?;
    
    logger::info!("Database has been reset successfully.", "");
    
    Ok(())
}
