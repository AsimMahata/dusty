use std::fs;
use std::path::PathBuf;

pub fn delete_file(path: &PathBuf) -> Result<(), std::io::Error> {
    fs::remove_file(path)
}

pub fn delete_directory(path: &PathBuf, recursive: bool) -> Result<(), std::io::Error> {
    if recursive {
        fs::remove_dir_all(path)
    } else {
        fs::remove_dir(path)
    }
}
