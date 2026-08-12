use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use std::fs;
use std::path::PathBuf;

pub fn delete_file(path: &PathBuf) -> Result<()> {
    fs::remove_file(path).map_err(|e| DustyError::io("delete_file", path, e))
}

pub fn delete_directory(path: &PathBuf, recursive: bool) -> Result<()> {
    if recursive {
        fs::remove_dir_all(path).map_err(|e| DustyError::io("delete_directory_recursive", path, e))
    } else {
        fs::remove_dir(path).map_err(|e| DustyError::io("delete_directory", path, e))
    }
}