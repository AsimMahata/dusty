use crate::dusty::data::{shows::ShowResult, state::AppState};
use crate::dusty::db::ban::{ban_show_in_db, print_all_banned_shows, unban_show_in_db};
use crate::dusty::db::show::{
    add_shows_in_db, print_all_shows_in_db, reset_show_table_in_db, update_ban_status_in_db, update_pin_status_in_db, update_show_status_in_db,
};
use crate::dusty::db::show::{get_show_info, rename_show_in_db};
use crate::dusty::scanners::show_scanner::scan_for_shows_rec;
use crate::dusty::utility::convert::show_to_show_result;
use std::path::PathBuf;

#[tauri::command]
pub fn scan_shows(state: tauri::State<AppState>, path: String) -> Vec<ShowResult> {
    let root = PathBuf::from(&path);
    let shows = scan_for_shows_rec(&root);
    let result: Vec<ShowResult> = shows
        .get_list_of_shows()
        .iter()
        .map(|s| show_to_show_result(s))
        .collect();

    let db = state.db.lock().unwrap();
    add_shows_in_db(&db, &result).ok();
    print_all_shows_in_db(&db).ok();

    result
        .into_iter()
        .map(|mut show| {
            if let Ok(info) = get_show_info(&db, &show.id) {
                show.title = info.title;
                show.status = info.status;
                show.banned = info.banned;
                show.pinned = info.pinned;
            }
            show
        })
        .collect()
}

#[tauri::command]
pub fn ban_show(state: tauri::State<AppState>, show_id: String) {
    let db = state.db.lock().unwrap();
    ban_show_in_db(&db, show_id)
        .map_err(|e| format!("Failed to insert ban: {}", e))
        .ok();

    print_all_banned_shows(&db).ok();
}

#[tauri::command]
pub fn unban_show(state: tauri::State<AppState>, show_id: String) {
    let db = state.db.lock().unwrap();
    unban_show_in_db(&db, show_id)
        .map_err(|e| format!("Failed to delete ban: {}", e))
        .ok();

    print_all_banned_shows(&db).ok();
}

#[tauri::command]
pub fn rename_show(state: tauri::State<AppState>, show_id: String, new_name: String) -> bool {
    let db = state.db.lock().unwrap();
    rename_show_in_db(&db, show_id, new_name)
        .map_err(|e| format!("Failed to rename show: {}", e))
        .is_ok()
}

#[tauri::command]
pub fn update_show_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_status: String,
) -> bool {
    let db = state.db.lock().unwrap();
    update_show_status_in_db(&db, show_id, new_status).is_ok()
}

#[tauri::command]
pub fn update_ban_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_ban_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    update_ban_status_in_db(&db, show_id, new_ban_status).is_ok()
}

#[tauri::command]
pub fn update_pin_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_pin_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    update_pin_status_in_db(&db, show_id, new_pin_status).is_ok()
}

#[tauri::command]
pub fn reset_shows_table(state: tauri::State<AppState>)->Result<(),String>{
    let db = state.db.lock().unwrap();
    reset_show_table_in_db(&db).map_err(|e| format!("Failed to reset shows table: {}", e)).ok();
    print_all_shows_in_db(&db).ok();
    Ok(())
}