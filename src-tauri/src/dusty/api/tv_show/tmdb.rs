use crate::dusty::data::state::AppState;
use crate::dusty::db::tv_show::{
    add_to_tmdb_cache_in_db, get_from_tmdb_cache_in_db, reset_tmdb_cache_table_in_db,
    update_in_tmdb_cache_in_db,
};

#[tauri::command]
pub fn get_tv_show_info_from_tmdb(state: tauri::State<AppState>, id: String) -> Result<String, String> {
    let db = state.db.lock().unwrap();
    let result = get_from_tmdb_cache_in_db(&db, id.clone());
    match result {
        Ok(data) => match data {
            Some(data) => Ok(data),
            None => Err(format!("No data found for id {}", id)),
        },
        Err(err) => Err(err),
    }
}

#[tauri::command]
pub fn update_tv_show_info_in_tmdb_cache(
    state: tauri::State<AppState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = update_in_tmdb_cache_in_db(&db, id, data);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

#[tauri::command]
pub fn add_tv_show_info_to_tmdb_cache(
    state: tauri::State<AppState>,
    id: String,
    data: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = add_to_tmdb_cache_in_db(&db, id, data);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

#[tauri::command]
pub fn reset_tmdb_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = reset_tmdb_cache_table_in_db(&db);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}
