use crate::dusty::data::file::FileInfo;
use crate::dusty::engine::dusty::zip::list_large_zip_files;

#[tauri::command]
pub fn scan_zip() -> Vec<FileInfo> {
    list_large_zip_files()
}
