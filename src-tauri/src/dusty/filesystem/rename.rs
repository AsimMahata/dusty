use std::fs;
use std::path::PathBuf;

pub fn move_file(src: &PathBuf, dst: &PathBuf) -> Result<(), std::io::Error> {
    fs::rename(src, dst)
}

pub fn rename_file(src: &PathBuf, dst: &PathBuf) -> Result<(), std::io::Error> {
    fs::rename(src, dst)
}
