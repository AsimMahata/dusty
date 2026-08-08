use std::path::PathBuf;
use serde::{Deserialize, Serialize};

use crate::dusty::{data::file::FileInfo, utility::sha256_hash::get_sha256_id};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZipDir {
    pub id: String,
    pub path: PathBuf,
    pub size: Option<u64>,
    pub files: Vec<FileInfo>,
    pub childs: Vec<ZipDir>,
}

impl ZipDir {
    pub fn new(path: PathBuf) -> Self {
        let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE");
        Self {
            id: get_sha256_id(path_str.to_string(), "zipdir".to_string()),
            path,
            size: Some(0),
            files: Vec::new(),
            childs: Vec::new(),
        }
    }
}
