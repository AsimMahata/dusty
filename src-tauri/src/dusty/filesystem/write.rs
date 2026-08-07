use std::fs;
use std::io::Write;
use std::path::PathBuf;

pub fn write_file(path: &PathBuf, content: &str) -> Result<(), std::io::Error> {
    fs::write(path, content)
}

pub fn append_file(path: &PathBuf, content: &str) -> Result<(), std::io::Error> {
    let mut file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open(path)?;
    file.write_all(content.as_bytes())
}

pub fn create_directory(path: &PathBuf) -> Result<(), std::io::Error> {
    fs::create_dir_all(path)
}
