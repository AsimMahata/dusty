use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use std::fs;
use std::io::Write;
use std::path::PathBuf;

pub fn write_file(path: &PathBuf, content: &str) -> Result<()> {
    fs::write(path, content).map_err(|e| DustyError::io("write_file", path, e))
}

pub fn append_file(path: &PathBuf, content: &str) -> Result<()> {
    let mut file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open(path)
        .map_err(|e| DustyError::io("open_file_for_append", path, e))?;
    file.write_all(content.as_bytes())
        .map_err(|e| DustyError::io("append_to_file", path, e))
}

pub fn create_directory(path: &PathBuf) -> Result<()> {
    fs::create_dir_all(path).map_err(|e| DustyError::io("create_directory", path, e))
}
