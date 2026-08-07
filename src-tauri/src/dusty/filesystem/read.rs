use std::{fs, path::PathBuf};

use mime_guess::mime::Name;

use crate::dusty::utility::info::get_file_type;

pub fn list_raw(path: &PathBuf) -> Vec<PathBuf> {
    match fs::read_dir(path) {
        Ok(entries) => entries.flatten().map(|e| e.path()).collect(),
        Err(_) => Vec::new(),
    }
}

pub fn list_files_of_type(path: &PathBuf, type_: Name<'static>) -> Vec<PathBuf> {
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(_) => return Vec::new(),
    };
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
    files
}

pub fn read_file(path: &PathBuf) -> Result<String, std::io::Error> {
    fs::read_to_string(path)
}
