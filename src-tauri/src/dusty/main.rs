use std::{
    path::{self, Path, PathBuf},
    sync::Mutex,
};

use mime_guess::mime;
use rusqlite::Connection;
use serde::Serialize;

use crate::dusty::{
    data::{
        file::FileInfo,
        project::Project,
        shows::{Show, ShowResult},
        state::AppState,
    },
    db::{
        ban::{ban_bad_item, is_banned, print_all_banned_items, unban_bad_item},
        show::{add_shows_in_db, print_all_shows_in_db},
    },
    engine::{
        dusty::{empty_dir::list_empty_dirs, zip::list_large_zip_files},
        project::scanner::scan_all_projects,
    },
    scanners::{dfs::dfs_file_of_type, files::scan_dir, show_scanner::scan_for_shows_rec},
    utility::{convert::show_to_show_result, info::is_windows_root, sha256_hash::get_sha256_id},
};

use tauri_plugin_opener::OpenerExt;

//FILESYSTEM
#[tauri::command]
pub fn read_dir(path: String) -> Vec<FileInfo> {
    let dir: PathBuf = PathBuf::from(&path);
    scan_dir(&dir)
}

//OPENER
#[tauri::command]
pub fn open_file(app: tauri::AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(&path, None::<&str>)
        .map_err(|e| e.to_string())
}

// VIDEO
#[tauri::command]
pub fn scan_video(path: String) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);

    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::VIDEO, &mut list, is_windows_root(&root));

    list.into_iter()
        .filter_map(|path| match FileInfo::from_pathbuf(&path) {
            Ok(info) => Some(info),
            Err(err) => {
                eprintln!("{}: {}", path.display(), err);
                None
            }
        })
        .collect()
}

// ZIP
#[tauri::command]
pub fn scan_zip() -> Vec<FileInfo> {
    list_large_zip_files()
}

// EMPTY DIR
#[tauri::command]
pub fn scan_empty_dir() -> Vec<FileInfo> {
    list_empty_dirs()
}

// IMAGE
#[tauri::command]
pub fn scan_image(path: String) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);

    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::IMAGE, &mut list, is_windows_root(&root));

    list.into_iter()
        .filter_map(|path| match FileInfo::from_pathbuf(&path) {
            Ok(info) => Some(info),
            Err(err) => {
                eprintln!("{}: {}", path.display(), err);
                None
            }
        })
        .collect()
}

// MUSIC
#[tauri::command]
pub fn scan_music(path: String) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);

    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::AUDIO, &mut list, is_windows_root(&root));

    list.into_iter()
        .filter_map(|path| match FileInfo::from_pathbuf(&path) {
            Ok(info) => Some(info),
            Err(err) => {
                eprintln!("{}: {}", path.display(), err);
                None
            }
        })
        .collect()
}

// SHOW

#[tauri::command]
pub fn scan_shows(state: tauri::State<AppState>, path: String) -> Vec<ShowResult> {
    let root = PathBuf::from(&path);
    let shows = scan_for_shows_rec(&root);
    let result: Vec<ShowResult> = shows
        .get_list_of_shows()
        .iter()
        .map(|s| show_to_show_result(s))
        .collect();

    let mut db = state.db.lock().unwrap();
    add_shows_in_db(&mut db, &result).ok();
    print_all_shows_in_db(&mut db).ok();

    result
        .into_iter()
        .map(|mut show| {
            show.is_banned = Some(is_banned(&db, show.id.clone()));
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

// PROJECT

#[tauri::command]
pub fn scan_projects() -> Vec<Project> {
    let projects: Vec<Project> = scan_all_projects();
    return projects;
}
