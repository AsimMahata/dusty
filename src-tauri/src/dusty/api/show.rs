use rusqlite::Connection;

use crate::dusty::data::shows::Show;
use crate::dusty::data::{shows::ShowResult, state::AppState};
use crate::dusty::db::show_cache::get_all_shows_from_show_cache_in_db;
use crate::dusty::logger::logger;
use crate::dusty::db::show::{
    add_shows_in_db, print_all_shows_in_db, reset_show_table_in_db, update_ban_status_in_db, update_mal_id_in_db, update_pin_status_in_db, update_show_status_in_db,
};
use crate::dusty::db::show::{get_show_info, rename_show_in_db};
use crate::dusty::scanners::show_scanner::{scan_for_shows_rec, scan_for_shows_with_seasons};
use crate::dusty::utility::convert::show_to_show_result;
use std::path::PathBuf;

 


pub fn scan_show_new(db:&Connection,root:&PathBuf)->Vec<ShowResult>{
    let cached_shows = get_all_shows_from_show_cache_in_db(&db);
    match cached_shows {
        Ok(shows)=>{
            shows
        },
        Err(_)=>{
            let shows:Vec<ShowResult> = scan_for_shows_with_seasons(&db,&root);
            add_shows_in_db(&db, &shows).ok();
            shows
        }
    }
    
    
}

pub fn scan_show_old(db:&Connection,root:&PathBuf)->Vec<ShowResult>{
    let shows = scan_for_shows_rec(&root);
    let result: Vec<ShowResult> = shows
        .get_list_of_shows()
        .iter()
        .map(|s| show_to_show_result(s))
        .collect();


    add_shows_in_db(&db, &result).ok();

    result
        .into_iter()
        .map(|mut show| {
            if let Ok(info) = get_show_info(&db, &show.id) {
                show.title = info.title;
                show.status = info.status;
                show.banned = info.banned;
                show.pinned = info.pinned;
                show.mal_id = info.mal_id;
            }
            show
        })
        .collect()
}

#[tauri::command]
pub fn scan_shows(state: tauri::State<AppState>, path: String) -> Vec<ShowResult> {
   let db = state.db.lock().unwrap();
   let root = PathBuf::from(&path);
//    scan_show_old(&db,&root)
    scan_show_new(&db,&root)
}

#[tauri::command]
pub fn rename_show(state: tauri::State<AppState>, show_id: String, new_name: String) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = rename_show_in_db(&db, show_id.clone(), new_name.clone()) {
        logger::error!("RENAME_SHOW_FAILED", err);
        return false;
    }
    logger::info!("RENAME_SHOW_SUCCESS", show_id, new_name);
    true
}

#[tauri::command]
pub fn update_show_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_status: String,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_show_status_in_db(&db, show_id.clone(), new_status.clone()) {
        logger::error!("UPDATE_SHOW_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_SHOW_STATUS_SUCCESS", show_id, new_status);
    true
}

#[tauri::command]
pub fn update_ban_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_ban_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_ban_status_in_db(&db, show_id.clone(), new_ban_status) {
        logger::error!("UPDATE_BAN_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_BAN_STATUS_SUCCESS", show_id, new_ban_status);
    true
}

#[tauri::command]
pub fn update_pin_status(
    state: tauri::State<AppState>,
    show_id: String,
    new_pin_status: bool,
) -> bool {
    let db = state.db.lock().unwrap();
    if let Err(err) = update_pin_status_in_db(&db, show_id.clone(), new_pin_status) {
        logger::error!("UPDATE_PIN_STATUS_FAILED", err);
        return false;
    }
    logger::info!("UPDATE_PIN_STATUS_SUCCESS", show_id, new_pin_status);
    true
}

#[tauri::command]
pub fn reset_shows_table(state: tauri::State<AppState>) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    reset_show_table_in_db(&db)
        .map_err(|e| format!("Failed to reset shows table: {}", e))
        .ok();
    print_all_shows_in_db(&db).ok();
    Ok(())
}

#[tauri::command]
pub fn update_mal_id(state: tauri::State<AppState>,id:String,mal_id:i32)->Result<(),String>{
    let db = state.db.lock().unwrap();
    update_mal_id_in_db(&db,id,mal_id).map_err(|e| format!("Failed to update mal id in db: {}", e)).ok();
    Ok(())
}