use crate::dusty::data::{shows::ShowResult, state::AppState};
use crate::dusty::db::show::rename_show_in_db;
use crate::dusty::db::{
    ban::{ban_bad_item, is_banned, print_all_banned_items, unban_bad_item},
    show::{add_shows_in_db, get_title_from_db, print_all_shows_in_db},
};
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
            show.is_banned = Some(is_banned(&db, show.id.clone()));
            if let Ok(title) = get_title_from_db(&db, show.id.clone()) {
                show.title = title;
            }
            show
        })
        .collect()
}

#[tauri::command]
pub fn ban_show(state: tauri::State<AppState>, show_id: String) {
    let mut db = state.db.lock().unwrap();
    ban_bad_item(&mut db, show_id)
        .map_err(|e| format!("Failed to insert ban: {}", e))
        .ok();

    print_all_banned_items(&mut db).ok();
}

#[tauri::command]
pub fn unban_show(state: tauri::State<AppState>, show_id: String) {
    let mut db = state.db.lock().unwrap();
    unban_bad_item(&mut db, show_id)
        .map_err(|e| format!("Failed to delete ban: {}", e))
        .ok();

    print_all_banned_items(&mut db).ok();
}

#[tauri::command]
pub fn rename_show(state: tauri::State<AppState>, show_id: String, new_name: String)->bool {
    let db = state.db.lock().unwrap();
    rename_show_in_db(&db, show_id, new_name)
        .map_err(|e| format!("Failed to rename show: {}", e)).is_ok()
}
