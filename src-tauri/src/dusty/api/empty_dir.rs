use crate::dusty::data::file::FileInfo;
use crate::dusty::engine::dusty::empty_dir::list_empty_dirs;

#[tauri::command]
pub fn scan_empty_dir() -> Vec<FileInfo> {
    list_empty_dirs()
}
