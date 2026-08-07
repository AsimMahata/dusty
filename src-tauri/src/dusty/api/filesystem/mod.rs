use crate::dusty::data::file::FileInfo;
use crate::dusty::filesystem::{
    copy, delete, metadata::{self, FileMetadata}, read, rename, reveal, scan, write,
};
use std::path::PathBuf;

#[tauri::command]
pub fn read_dir(path: String) -> Vec<FileInfo> {
    let dir: PathBuf = PathBuf::from(&path);
    scan::scan_dir(&dir)
}

#[tauri::command]
pub fn reveal_in_file_explorer(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    reveal::reveal_in_file_explorer(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    let path = PathBuf::from(path);
    read::read_file(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::write_file(&path, &content)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn append_file(path: String, content: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::append_file(&path, &content)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn copy_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    copy::copy_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn move_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    rename::move_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn rename_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    rename::rename_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    delete::delete_file(&path)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::create_directory(&path)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_directory(path: String, recursive: bool) -> Result<bool, String> {
    let path = PathBuf::from(path);
    delete::delete_directory(&path, recursive)
        .map(|_| true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn exists(path: String) -> bool {
    let path = PathBuf::from(path);
    metadata::exists(&path)
}

#[tauri::command]
pub fn get_metadata(path: String) -> Result<FileMetadata, String> {
    let path = PathBuf::from(path);
    metadata::get_metadata(&path).map_err(|e| e.to_string())
}
