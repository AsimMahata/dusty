use std::{path::Path, process::Command};

use which::which;

use crate::dusty::logger::logger;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

const TERMINALS: &[&str] = &[
    // Windows
    "wt",
    "powershell",
    "pwsh",
    "cmd",
    // Linux
    "gnome-terminal",
    "konsole",
    "kitty",
    "alacritty",
    "wezterm",
    "xfce4-terminal",
    "tilix",
    "xterm",
    "terminator",
    // macOS
    "Terminal",
];

pub fn available_terminals() -> Vec<String> {
    TERMINALS
        .iter()
        .filter(|t| which(t).is_ok())
        .map(|t| (*t).to_string())
        .collect()
}

pub fn open_terminal_at(path: &Path, terminal: &String) -> std::io::Result<()> {
    logger::debug!("TERMINAL_REQUEST", path, terminal);
    
    let mut cmd = Command::new(terminal);
    
    if terminal == "wt" {
        cmd.args(["-d", path.to_str().unwrap()]);
    } else if terminal == "powershell" || terminal == "pwsh" {
        cmd.args(["-NoExit", "-Command", &format!("Set-Location '{}'", path.display())]);
    } else {
        cmd.current_dir(path);
    }

    #[cfg(target_os = "windows")]
    {
        // CREATE_NEW_CONSOLE = 0x00000010
        cmd.creation_flags(0x00000010);
    }

    cmd.spawn()?;

    Ok(())
}

