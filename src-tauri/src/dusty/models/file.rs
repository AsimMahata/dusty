use std::io::Error;
use std::io::ErrorKind;
use std::path::PathBuf;

use serde::Deserialize;
use serde::Serialize;

use crate::dusty::filesystem::metadata as fs_meta;
use crate::dusty::utility::sha256_hash::get_sha256_id;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FileInfo {
    pub id: String,
    pub name: String,
    pub path: PathBuf,
    pub size: u64,
    pub ext: Option<String>,
    pub is_dir: bool,
}

impl FileInfo {
    pub fn new(name: String, path: PathBuf, size: u64, ext: Option<String>, is_dir: bool) -> Self {
        let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE");
        let id = get_sha256_id(path_str.to_string(), "file".to_string());
        Self {
            id,
            name,
            path,
            size,
            ext,
            is_dir,
        }
    }

    pub fn from_pathbuf(path: &PathBuf) -> Result<Self, Error> {
        let size = fs_meta::size(path);

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

        let path_str = path
            .to_str()
            .ok_or_else(|| Error::new(ErrorKind::InvalidData, "Path is not valid UTF-8"))?;

        let id = get_sha256_id(path_str.to_string(), "file".to_string());

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

    pub fn get_path(&self) -> &PathBuf {
        &self.path
    }
}
