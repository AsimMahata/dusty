use std::path::PathBuf;
use std::process::Command;

pub fn reveal_in_file_explorer(path: &PathBuf) -> Result<(), std::io::Error> {
    let path_str = path.to_string_lossy();
    
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path_str])
            .spawn()?;
    }
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path_str])
            .spawn()?;
    }
    
    #[cfg(target_os = "linux")]
    {
        if let Some(parent) = path.parent() {
            Command::new("xdg-open")
                .arg(parent)
                .spawn()?;
        }
    }
    
    Ok(())
}
