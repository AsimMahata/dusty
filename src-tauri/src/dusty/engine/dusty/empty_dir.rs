use std::path::PathBuf;

use crate::dusty::{
    data::file::FileInfo,
    filesystem::scan::{list_children, ScanOptions},
    utility::info::{get_all_valid_source_path, is_root},
};

pub fn list_empty_dirs() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for drive in get_all_valid_source_path() {
        list.extend(list_empty_dirs_in_path(drive));
    }
    list
}

pub fn list_empty_dirs_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut empty_dirs: Vec<FileInfo> = Vec::new();
    dfs_empty_dir_scanner(&path, &mut empty_dirs, is_root(&path));
    empty_dirs
}

pub fn dfs_empty_dir_scanner(path: &PathBuf, empty_dirs: &mut Vec<FileInfo>, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for child in children.dirs {
        dfs_empty_dir_scanner(&child, empty_dirs, false);
    }
    if children.total_count == 0 {
        FileInfo::from_pathbuf(path).ok().map(|info| empty_dirs.push(info));
    }
}
