use tauri_plugin_opener::OpenerExt;

use crate::dusty::api::opener::open_file;
use crate::dusty::data::file::FileInfo;
use crate::dusty::scanners::files::scan_dir;
use std::path::PathBuf;

#[tauri::command]
pub fn read_dir(path: String) -> Vec<FileInfo> {
    let dir: PathBuf = PathBuf::from(&path);
    scan_dir(&dir)
}

#[tauri::command]
pub fn reveal_in_file_explorer(app: tauri::AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(&path, None::<&str>)
        .map_err(|e| e.to_string())
}
