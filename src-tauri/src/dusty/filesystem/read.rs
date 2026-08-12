use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use crate::dusty::utility::info::get_file_type;
use mime_guess::mime::Name;
use std::fs;
use std::path::PathBuf;

pub fn list_raw(path: &PathBuf) -> Result<Vec<PathBuf>> {
    let entries = fs::read_dir(path).map_err(|e| DustyError::io("scan_directory", path, e))?;
    Ok(entries.flatten().map(|e| e.path()).collect())
}

pub fn list_files_of_type(path: &PathBuf, type_: Name<'static>) -> Result<Vec<PathBuf>> {
    let entries = fs::read_dir(path).map_err(|e| DustyError::io("scan_directory", path, e))?;
    let mut files = Vec::new();
    for entry in entries.flatten() {
        let child = entry.path();
        if !child.is_dir() {
            if let Some(guess) = get_file_type(&child) {
                if guess == type_ {
                    files.push(child);
                }
            }
        }
    }
    Ok(files)
}

pub fn read_file(path: &PathBuf) -> Result<String> {
    fs::read_to_string(path).map_err(|e| DustyError::io("read_file", path, e))
}
