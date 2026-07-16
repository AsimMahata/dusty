use serde::{Deserialize, Serialize};

use crate::dusty::{data::file::FileInfo, utility::sha256_hash::get_sha256_id};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MediaDir {
    pub id: String,
    pub path: String,
    pub size: Option<u64>,
    pub media: Vec<FileInfo>,
    pub childs: Vec<MediaDir>,
    pub media_type: Option<String>,
}

impl MediaDir {
    pub fn new(path: String, media_type: Option<String>) -> Self {
        Self {
            id: get_sha256_id(path.clone(), "mediadir".to_string()),
            path,
            size: Some(0),
            media: Vec::new(),
            childs: Vec::new(),
            media_type,
        }
    }
}
