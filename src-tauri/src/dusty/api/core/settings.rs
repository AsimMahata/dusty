use crate::dusty::db::core::delete_all_tables;
use crate::dusty::db::core::initialize_tables;
use crate::dusty::error::DustyError;
use crate::dusty::logger::logger;
use crate::dusty::models::state::AppState;
use tauri::Manager;
use tauri::State;

#[tauri::command]
pub async fn reset_database(
    app_handle: tauri::AppHandle,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let tables = state.tables.clone();
    state
        .db_worker
        .run(move |db| {
            delete_all_tables(db, &tables).map_err(|e| {
                logger::error!("DELETE_ALL_TABLES_FAILED", e.log_details());
                e.to_user_message()
            })?;

            initialize_tables(db).map_err(|e| {
                logger::error!("INITIALIZE_TABLES_FAILED", e.log_details());
                e.to_user_message()
            })?;
            Ok::<(), String>(())
        })
        .await
        .map_err(|e| e.to_string())??;

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

    logger::info!(
        "Database and ~/.dusty directory have been reset successfully.",
        ""
    );
    Ok(())
}
