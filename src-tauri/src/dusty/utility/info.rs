use std::{env::home_dir, fs, os::windows::prelude::*, path::PathBuf};

use mime_guess::mime::{self, Name};

const BAD_SIBLINGS: &[&str] = &[".git", "node_modules", ".venv", "venv", ".cph", "dist"];

//TODO: make it custom user based with some defaults

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

pub fn is_forbidden_folder(path: &PathBuf) -> bool {
    return get_forbidden_folders().iter().any(|f| f.eq(path));
}

pub fn is_hidden(file_path: &PathBuf) -> bool {
    fs::metadata(file_path)
        .map(|m| (m.file_attributes() & 0x2) > 0)
        .unwrap_or(true)
}

pub fn check_for_bad_sibling(childrens: &Vec<PathBuf>) -> bool {
    //Check for BAD_SIBLINGS
    childrens.iter().any(|c| {
        c.file_name()
            .and_then(|n| n.to_str())
            .map_or(false, |s| BAD_SIBLINGS.contains(&s))
    })
}
pub fn is_windows_root(path: &PathBuf) -> bool {
    return path.eq(&PathBuf::from("C:\\"));
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

pub fn get_all_drives() -> Vec<PathBuf> {
    let mut drives: Vec<PathBuf> = Vec::new();
    drives.push(PathBuf::from("C:\\"));
    return drives;
}

pub fn is_git_repo(path: &PathBuf) -> bool {
    path.join(".git").exists()
}
