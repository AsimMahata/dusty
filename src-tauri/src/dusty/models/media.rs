use serde::Deserialize;
use serde::Serialize;
use std::path::PathBuf;

use crate::dusty::models::file::FileInfo;
use crate::dusty::utility::sha256_hash::get_sha256_id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MediaDir {
    pub id: String,
    pub path: PathBuf,
    pub size: Option<u64>,
    pub media: Vec<FileInfo>,
    pub childs: Vec<MediaDir>,
    pub media_type: Option<String>,
}

impl MediaDir {
    pub fn new(path: PathBuf, media_type: Option<String>) -> Self {
        let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE");
        Self {
            id: get_sha256_id(path_str.to_string(), "mediadir".to_string()),
            path,
            size: Some(0),
            media: Vec::new(),
            childs: Vec::new(),
            media_type,
        }
    }
}
