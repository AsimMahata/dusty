use std::fs;
use std::path::PathBuf;
use crate::dusty::error::{DustyError, Result};

pub fn move_file(src: &PathBuf, dst: &PathBuf) -> Result<()> {
    fs::rename(src, dst)
        .map_err(|e| DustyError::io("move_file", src, e))
}

pub fn rename_file(src: &PathBuf, dst: &PathBuf) -> Result<()> {
    fs::rename(src, dst)
        .map_err(|e| DustyError::io("rename_file", src, e))
}
