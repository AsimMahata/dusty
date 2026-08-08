use std::fs;
use std::path::PathBuf;
use crate::dusty::error::{DustyError, Result};

pub fn copy_file(src: &PathBuf, dst: &PathBuf) -> Result<()> {
    fs::copy(src, dst)
        .map(|_| ())
        .map_err(|e| DustyError::io("copy_file", src, e))
}
