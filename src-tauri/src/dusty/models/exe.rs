use std::path::PathBuf;
use serde::{Deserialize, Serialize};

use crate::dusty::{models::file::FileInfo, utility::sha256_hash::get_sha256_id};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ExecutableDir {
    pub id: String,
    pub path: PathBuf,
    pub size: Option<u64>,
    pub files: Vec<FileInfo>,
    pub childs: Vec<ExecutableDir>,
}

impl ExecutableDir {
    pub fn new(path: PathBuf) -> Self {
        let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE");
        Self {
            id: get_sha256_id(path_str.to_string(), "exedir".to_string()),
            path,
            size: Some(0),
            files: Vec::new(),
            childs: Vec::new(),
        }
    }
}
