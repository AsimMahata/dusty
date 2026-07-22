use serde::{Deserialize, Serialize};

use crate::dusty::{data::file::FileInfo, utility::sha256_hash::get_sha256_id};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZipDir {
    pub id: String,
    pub path: String,
    pub size: Option<u64>,
    pub files: Vec<FileInfo>,
    pub childs: Vec<ZipDir>,
}

impl ZipDir {
    pub fn new(path: String) -> Self {
        Self {
            id: get_sha256_id(path.clone(), "zipdir".to_string()),
            path,
            size: Some(0),
            files: Vec::new(),
            childs: Vec::new(),
        }
    }
}
