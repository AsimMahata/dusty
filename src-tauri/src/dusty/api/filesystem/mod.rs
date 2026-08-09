use crate::dusty::models::file::FileInfo;
use crate::dusty::filesystem::{
    copy, delete, metadata::{self, FileMetadata}, read, rename, reveal, scan, write,
};
use crate::dusty::logger::logger;
use std::path::PathBuf;

#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<FileInfo>, String> {
    let dir = PathBuf::from(&path);
    scan::scan_dir(&dir).map_err(|e| {
        logger::error!("READ_DIR_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn reveal_in_file_explorer(path: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    reveal::reveal_in_file_explorer(&path).map_err(|e| {
        logger::error!("REVEAL_IN_FILE_EXPLORER_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    let path = PathBuf::from(path);
    read::read_file(&path).map_err(|e| {
        logger::error!("READ_FILE_FAILED", e.log_details());
        e.to_user_message()
    })
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::write_file(&path, &content)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("WRITE_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn append_file(path: String, content: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::append_file(&path, &content)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("APPEND_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn copy_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    copy::copy_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("COPY_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn move_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    rename::move_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("MOVE_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn rename_file(src: String, dst: String) -> Result<bool, String> {
    let src = PathBuf::from(src);
    let dst = PathBuf::from(dst);
    rename::rename_file(&src, &dst)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("RENAME_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    delete::delete_file(&path)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("DELETE_FILE_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);
    write::create_directory(&path)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("CREATE_DIRECTORY_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn delete_directory(path: String, recursive: bool) -> Result<bool, String> {
    let path = PathBuf::from(path);
    delete::delete_directory(&path, recursive)
        .map(|_| true)
        .map_err(|e| {
            logger::error!("DELETE_DIRECTORY_FAILED", e.log_details());
            e.to_user_message()
        })
}

#[tauri::command]
pub fn exists(path: String) -> bool {
    let path = PathBuf::from(path);
    metadata::exists(&path)
}

#[tauri::command]
pub fn get_metadata(path: String) -> Result<FileMetadata, String> {
    let path = PathBuf::from(path);
    metadata::get_metadata(&path).map_err(|e| {
        logger::error!("GET_METADATA_FAILED", e.log_details());
        e.to_user_message()
    })
}
