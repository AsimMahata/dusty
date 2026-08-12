use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use std::fs;
use std::path::PathBuf;

pub fn copy_file(src: &PathBuf, dst: &PathBuf) -> Result<()> {
    fs::copy(src, dst)
        .map(|_| ())
        .map_err(|e| DustyError::io("copy_file", src, e))
}
