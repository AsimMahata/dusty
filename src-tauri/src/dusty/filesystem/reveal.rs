use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use std::path::PathBuf;
use std::process::Command;

pub fn reveal_in_file_explorer(path: &PathBuf) -> Result<()> {
    let path_str = path.to_str().ok_or_else(|| {
        DustyError::invalid_path(path, "Path to reveal in file explorer is not valid UTF-8")
    })?;

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", path_str])
            .spawn()
            .map_err(|e| DustyError::io("reveal_in_file_explorer", path, e))?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", path_str])
            .spawn()
            .map_err(|e| DustyError::io("reveal_in_file_explorer", path, e))?;
    }

    #[cfg(target_os = "linux")]
    {
        if let Some(parent) = path.parent() {
            Command::new("xdg-open")
                .arg(parent)
                .spawn()
                .map_err(|e| DustyError::io("reveal_in_file_explorer", path, e))?;
        }
    }

    Ok(())
}
