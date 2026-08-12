use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use serde::Deserialize;
use serde::Serialize;
use std::fs;
#[cfg(target_os = "windows")]
use std::os::windows::prelude::*;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct FileMetadata {
    pub size: u64,
    pub created: Option<u64>,
    pub modified: Option<u64>,
    pub is_dir: bool,
    pub is_file: bool,
}

pub fn size(path: &PathBuf) -> u64 {
    fs::metadata(path).map(|m| m.len()).unwrap_or(0)
}

pub fn is_dir(path: &PathBuf) -> bool {
    path.is_dir()
}

pub fn exists(path: &PathBuf) -> bool {
    path.exists()
}

#[cfg(target_os = "windows")]
pub fn is_hidden(path: &PathBuf) -> bool {
    fs::metadata(path)
        .map(|m| (m.file_attributes() & 0x2) > 0)
        .unwrap_or(true)
}

#[cfg(target_os = "linux")]
pub fn is_hidden(path: &PathBuf) -> bool {
    path.file_name()
        .and_then(|name| name.to_str())
        .map(|name| name.starts_with('.'))
        .unwrap_or(false)
}

pub fn get_metadata(path: &PathBuf) -> Result<FileMetadata> {
    let meta = fs::metadata(path).map_err(|e| DustyError::io("get_metadata", path, e))?;
    let created = meta
        .created()
        .ok()
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| d.as_secs());
    let modified = meta
        .modified()
        .ok()
        .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
        .map(|d| d.as_secs());

    Ok(FileMetadata {
        size: meta.len(),
        created,
        modified,
        is_dir: meta.is_dir(),
        is_file: meta.is_file(),
    })
}
