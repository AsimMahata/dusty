use std::{fs, os::windows::prelude::*, path::PathBuf};

use mime_guess::mime::{self, Name};

const BAD_SIBLINGS: &[&str] = &[".git", "node_modules", ".venv", "venv", ".cph"];

//TODO: make it custom user based with some defaults

pub fn get_forbidden_folders() -> Vec<PathBuf> {
    vec![
        PathBuf::from("C:\\Windows"),
        PathBuf::from("C:\\Program Files"),
        PathBuf::from("C:\\Program Files (x86)"),
        PathBuf::from("C:\\ProgramData"),
        PathBuf::from("C:\\$Recycle.Bin"),
        PathBuf::from("C:\\System Volume Information"),
        PathBuf::from("C:\\Users\\Default"),
        PathBuf::from("C:\\MYAPPS\\"),
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
