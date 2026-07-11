use mime_guess::mime;
use std::{fs, path::PathBuf};

use crate::dusty::{
    data::file::FileInfo,
    utility::info::{
        check_for_bad_sibling, get_all_drives, is_forbidden_folder, is_hidden, is_windows_root,
    },
};

pub fn list_empty_dirs() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for drive in get_all_drives() {
        list.extend(list_empty_dirs_in_path(drive));
    }
    return list;
}

pub fn list_empty_dirs_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut empty_dirs: Vec<FileInfo> = Vec::new();
    dfs_empty_dir_scanner(&path, &mut empty_dirs, is_windows_root(&path));
    return empty_dirs;
}
pub fn dfs_empty_dir_scanner(path: &PathBuf, empty_dirs: &mut Vec<FileInfo>, is_root: bool) {
    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        println!("BAD_FOLDER found at {:?} SKIPPING ", path);
        return;
    };
    if !is_root && is_hidden(path) {
        println!("HIDDEN_FOLDER found at {:?} SKIPPING ", path);
        return;
    }
    if is_forbidden_folder(path) {
        println!("FORBIDDEN FOLDER found at {:?} SKIPPING", path);
        return;
    }
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };
    let mut childrens: Vec<PathBuf> = Vec::new();
    let mut count = 0;
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        count += 1;
        if child.is_dir() {
            childrens.push(child);
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_empty_dir_scanner(&child, empty_dirs, false);
    }
    if count == 0 {
        FileInfo::from_pathbuf(path)
            .ok()
            .map(|info| empty_dirs.push(info));
    }
}
