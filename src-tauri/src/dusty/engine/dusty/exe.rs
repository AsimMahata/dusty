use std::path::PathBuf;

use mime_guess::mime;

use crate::dusty::{
    data::file::FileInfo,
    filesystem::scan::{list_children, ScanOptions},
    utility::info::{get_all_valid_source_path, get_file_type, is_root},
};

pub fn list_executables() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_executables_in_path(root));
    }
    list
}

pub fn list_executables_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut executables: Vec<FileInfo> = Vec::new();
    dfs_executables_scanner(&path, &mut executables, is_root(&path));
    executables
}

pub fn dfs_executables_scanner(path: &PathBuf, executables: &mut Vec<FileInfo>, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in &children.files {
        if is_exe_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                executables.push(info);
            }
        }
    }
    for child in children.dirs {
        dfs_executables_scanner(&child, executables, false);
    }
}

pub fn is_exe_file(path: &PathBuf) -> bool {
    if let Some(guess) = get_file_type(path) {
        return guess.eq(&mime::PDF);
    }
    false
}
