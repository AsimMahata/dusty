use serde::Deserialize;
use serde::Serialize;
use std::path::PathBuf;

use crate::dusty::models::file::FileInfo;
use crate::dusty::utility::sha256_hash::get_sha256_id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MiscDir {
    pub id: String,
    pub path: PathBuf,
    pub size: Option<u64>,
    pub files: Vec<FileInfo>,
    pub childs: Vec<MiscDir>,
}

impl MiscDir {
    pub fn new(path: PathBuf, type_key: &str) -> Self {
        let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE");
        Self {
            id: get_sha256_id(path_str.to_string(), format!("miscdir_{}", type_key)),
            path,
            size: Some(0),
            files: Vec::new(),
            childs: Vec::new(),
        }
    }
}
