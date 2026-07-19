use std::{env::home_dir, fs, path::PathBuf};
#[cfg(target_os = "windows")]
use std::os::windows::prelude::*;
use sysinfo::Disks;

use mime_guess::mime::{self, Name};

const BAD_SIBLINGS: &[&str] = &[".git", "node_modules", ".venv", "venv", ".cph", "dist"];

//TODO: make it custom user based with some defaults

#[cfg(target_os = "windows")]
pub fn get_forbidden_folders() -> Vec<PathBuf> {
    vec![
        PathBuf::from("C:\\Windows"),
        PathBuf::from("C:\\temp"),
        PathBuf::from("C:\\Program Files"),
        PathBuf::from("C:\\Program Files (x86)"),
        PathBuf::from("C:\\ProgramData"),
        PathBuf::from("C:\\$Recycle.Bin"),
        PathBuf::from("C:\\System Volume Information"),
        PathBuf::from("C:\\Users\\Default"),
        PathBuf::from("C:\\MYAPPS\\"),
        PathBuf::from("C:\\MinGW\\"),
        PathBuf::from("C:\\msys64\\"),
        PathBuf::from("C:\\Users\\All Users"),
        home_dir()
            .expect("Some Error inside get is_forbidden_folder")
            .join("AppData"),
    ]
}

#[cfg(target_os = "linux")]
pub fn get_forbidden_folders() -> Vec<PathBuf> {
    vec![
        PathBuf::from("/bin"),
        PathBuf::from("/boot"),
        PathBuf::from("/dev"),
        PathBuf::from("/etc"),
        PathBuf::from("/lib"),
        PathBuf::from("/lib64"),
        PathBuf::from("/proc"),
        PathBuf::from("/run"),
        PathBuf::from("/sys"),
        PathBuf::from("/var"),
        PathBuf::from("/usr"),
    ]
}

pub fn is_forbidden_folder(path: &PathBuf) -> bool {
    return get_forbidden_folders().iter().any(|f| f.eq(path));
}

#[cfg(target_os = "windows")]
pub fn is_hidden(file_path: &PathBuf) -> bool {
    fs::metadata(file_path)
        .map(|m| (m.file_attributes() & 0x2) > 0)
        .unwrap_or(true)
}

#[cfg(target_os = "linux")]
pub fn is_hidden(file_path: &PathBuf) -> bool {
    file_path
        .file_name()
        .and_then(|name| name.to_str())
        .map(|name| name.starts_with('.'))
        .unwrap_or(false)
}

pub fn check_for_bad_sibling(childrens: &Vec<PathBuf>) -> bool {
    //Check for BAD_SIBLINGS
    childrens.iter().any(|c| {
        c.file_name()
            .and_then(|n| n.to_str())
            .map_or(false, |s| BAD_SIBLINGS.contains(&s))
    })
}
#[cfg(target_os = "windows")]
pub fn is_root(path: &PathBuf) -> bool {
    return path.eq(&PathBuf::from("C:\\"));
}

#[cfg(target_os = "linux")]
pub fn is_root(path: &PathBuf) -> bool {
    return path.eq(&PathBuf::from("/"));
}

pub fn get_file_type(file_path: &PathBuf) -> Option<Name<'static>> {
    let guess = mime_guess::from_path(&file_path);

    match guess.first() {
        Some(m) => match m.type_() {
            mime::VIDEO => Some(mime::VIDEO),
            mime::AUDIO => Some(mime::AUDIO),
            mime::IMAGE => Some(mime::IMAGE),
            _ => None,
        },
        None => None,
    }
}

pub fn get_all_valid_source_path() -> Vec<PathBuf> {
    let disks = Disks::new_with_refreshed_list();
    let mut drives: Vec<PathBuf> = Vec::new();
    
    for disk in disks.list() {
        drives.push(disk.mount_point().to_path_buf());
    }
    
    // Fallback if no disks are found
    if drives.is_empty() {
        #[cfg(target_os = "windows")]
        drives.push(PathBuf::from("C:\\"));
        #[cfg(target_os = "linux")]
        drives.push(PathBuf::from("/"));
    }
    
    return drives;
}

pub fn is_git_repo(path: &PathBuf) -> bool {
    path.join(".git").exists()
}
