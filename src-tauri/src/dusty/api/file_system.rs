use std::path::PathBuf;
use crate::dusty::data::file::FileInfo;
use crate::dusty::scanners::files::scan_dir;

#[tauri::command]
pub fn read_dir(path: String) -> Vec<FileInfo> {
    let dir: PathBuf = PathBuf::from(&path);
    scan_dir(&dir)
}
