use std::{
    fs::{Metadata, metadata},
    io::{Error, ErrorKind},
    path::{self, PathBuf},
};

#[derive(Debug, Clone)]
pub struct FileInfo {
    name: String,
    path: PathBuf,
    size: u64,
    ext: String,
    metadata: Metadata,
}

impl FileInfo {
    pub fn new(name: String, path: PathBuf, size: u64, ext: String, metadata: Metadata) -> Self {
        Self {
            name: name,
            path: path,
            size: size,
            ext: ext,
            metadata: metadata,
        }
    }
    pub fn from_pathbuf(path: &PathBuf) -> Result<Self, Error> {
        let metadata = metadata(path)
            .map_err(|_| Error::new(ErrorKind::NotFound, "Couldn't find metadata"))?;

        let size = metadata.len();

        let name = path
            .file_name()
            .and_then(|s| s.to_str())
            .ok_or_else(|| Error::new(ErrorKind::InvalidData, "Invalid file name"))?
            .to_owned();

        let ext = path
            .extension()
            .and_then(|s| s.to_str())
            .ok_or_else(|| Error::new(ErrorKind::InvalidData, "Invalid extension"))?
            .to_owned();

        Ok(Self {
            name,
            path: path.clone(),
            size,
            ext,
            metadata,
        })
    }
    pub fn get_size(&self) -> u64 {
        self.size
    }
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
}
