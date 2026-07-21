use std::{
    fs::metadata,
    io::{Error, ErrorKind},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};

use crate::dusty::utility::sha256_hash::get_sha256_id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FileInfo {
    pub(crate) id: String,
    name: String,
    path: PathBuf,
    size: u64,
    ext: Option<String>,
    is_dir: bool,
}

impl FileInfo {
    pub fn new(name: String, path: PathBuf, size: u64, ext: Option<String>, is_dir: bool) -> Self {
        let id = get_sha256_id(path.to_string_lossy().to_string(), "file".to_string());
        Self {
            id,
            name: name,
            path: path,
            size: size,
            ext: ext,
            is_dir: is_dir,
        }
    }
    pub fn from_pathbuf(path: &PathBuf) -> Result<Self, Error> {
        let size = metadata(path).map(|m| m.len()).unwrap_or(0);

        let name = path
            .file_name()
            .and_then(|s| s.to_str())
            .ok_or_else(|| Error::new(ErrorKind::InvalidData, "Invalid file name"))?
            .to_owned();

        let ext: Option<String> = path
            .extension()
            .and_then(|s| s.to_str())
            .map(|s| s.to_string());

        let is_dir: bool = path.is_dir();

        let id = get_sha256_id(path.to_string_lossy().to_string(), "file".to_string());

        Ok(Self {
            id,
            name,
            path: path.clone(),
            size,
            ext,
            is_dir,
        })
    }
    pub fn get_size(&self) -> u64 {
        self.size
    }
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
}
