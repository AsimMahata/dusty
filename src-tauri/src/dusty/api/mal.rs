use crate::dusty::data::state::AppState;
use crate::dusty::db::mal::{
    add_to_mal_cache_in_db, get_from_mal_cache_in_db, reset_mal_cache_table_in_db,
    update_in_mal_cache_in_db,
};

#[tauri::command]
pub fn get_anime_info_from_mal(state: tauri::State<AppState>, id: i32) -> Result<String, String> {
    let db = state.db.lock().unwrap();
    let result = get_from_mal_cache_in_db(&db, id.to_string());
    match result {
        Ok(data) => match data {
            Some(data) => Ok(data),
            None => Err(format!("No data found for id {}", id)),
        },
        Err(err) => Err(err),
    }
}

#[tauri::command]
pub fn update_anime_info_in_mal_cache(
    state: tauri::State<AppState>,
    id: i32,
    data: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = update_in_mal_cache_in_db(&db, id.to_string(), data);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}
#[tauri::command]
pub fn add_anime_info_to_mal_cache(
    state: tauri::State<AppState>,
    id: i32,
    data: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = add_to_mal_cache_in_db(&db, id.to_string(), data);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

#[tauri::command]
pub fn reset_mal_cache(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    let result = reset_mal_cache_table_in_db(&db);
    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}
