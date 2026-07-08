use std::path::{self, Path, PathBuf};

use mime_guess::mime;
use serde::Serialize;

use crate::dusty::{
    data::{file::FileInfo, project::Project},
    engine::project::scanner::scan_all_projects,
    scanners::{dfs::dfs_file_of_type, files::scan_dir, show_scanner::scan_for_shows_rec},
    utility::info::is_windows_root,
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
#[derive(Serialize, Debug)]
pub struct ShowResult {
    pub title: String,
    pub num_episodes: usize,
    pub episodes: Vec<FileInfo>,
    pub dir: String,
}

#[tauri::command]
pub fn scan_shows(path: String) -> Vec<ShowResult> {
    let root = PathBuf::from(&path);
    let shows = scan_for_shows_rec(&root);
    shows
        .get_list_of_shows()
        .iter()
        .map(|s| ShowResult {
            title: s.get_title(),
            num_episodes: s.get_number_of_ep(),
            episodes: s
                .get_eps()
                .iter()
                .map(|p| FileInfo::from_pathbuf(p).expect("Crashed on main inside dusty"))
                .collect(),
            dir: s.get_dir().to_string_lossy().into_owned(),
        })
        .collect()
}

// PROJECT

#[tauri::command]
pub fn scan_projects() -> Vec<Project> {
    let projects: Vec<Project> = scan_all_projects();
    return projects;
}
