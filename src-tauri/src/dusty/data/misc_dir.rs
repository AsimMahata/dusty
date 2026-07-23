use serde::{Deserialize, Serialize};

use crate::dusty::{data::file::FileInfo, utility::sha256_hash::get_sha256_id};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MiscDir {
    pub id: String,
    pub path: String,
    pub size: Option<u64>,
    pub files: Vec<FileInfo>,
    pub childs: Vec<MiscDir>,
}

impl MiscDir {
    pub fn new(path: String, type_key: &str) -> Self {
        Self {
            id: get_sha256_id(path.clone(), format!("miscdir_{}", type_key)),
            path,
            size: Some(0),
            files: Vec::new(),
            childs: Vec::new(),
        }
    }
}
