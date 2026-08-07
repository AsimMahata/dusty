use std::fs;
use std::path::PathBuf;

pub fn copy_file(src: &PathBuf, dst: &PathBuf) -> Result<(), std::io::Error> {
    fs::copy(src, dst).map(|_| ())
}
