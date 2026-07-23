use std::{fs, path::PathBuf};

use mime_guess::mime;

use crate::dusty::{
    data::file::FileInfo, utility::info::{
        check_for_bad_sibling, get_all_valid_source_path, get_file_type, is_forbidden_folder, is_hidden, is_root,
    },
};

pub fn list_executables() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_executables_in_path(root));
    }
    return list;
}

pub fn list_executables_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut executables: Vec<FileInfo> = Vec::new();
    dfs_executables_scanner(&path, &mut executables, is_root(&path));
    return executables;
}

pub fn dfs_executables_scanner(path: &PathBuf, executables: &mut Vec<FileInfo>, is_root: bool) {
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
    let mut childrens: Vec<PathBuf> = Vec::new();
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            if is_exe_file(&child) {
                let file = FileInfo::from_pathbuf(&child)
                    .expect("Crashed at zip.rs because cant get fileinfo for this file");
                executables.push(file);
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_executables_scanner(&child, executables, false);
    }
}

pub fn is_exe_file(path: &PathBuf) -> bool {
    if let Some(guess) = get_file_type(path){
        return guess.eq(&mime::PDF);
    }
    false
}
