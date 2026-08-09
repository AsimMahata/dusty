use std::path::PathBuf;

use crate::dusty::{
    models::file::FileInfo,
    filesystem::scan::{list_children, ScanOptions},
    utility::info::{get_all_valid_source_path, is_root},
};

pub fn list_large_zip_files() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for drive in get_all_valid_source_path() {
        list.extend(list_large_zip_files_in_path(drive));
    }
    list
}

pub fn list_large_zip_files_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut zips: Vec<FileInfo> = Vec::new();
    dfs_large_zip_scanner(&path, &mut zips, is_root(&path));
    zips
}

fn dfs_large_zip_scanner(path: &PathBuf, zips: &mut Vec<FileInfo>, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in &children.files {
        if is_zip_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                zips.push(info);
            }
        }
    }
    for child in children.dirs {
        dfs_large_zip_scanner(&child, zips, false);
    }
}

pub fn is_zip_file(path: &PathBuf) -> bool {
    matches!(
        path.extension().and_then(|e| e.to_str()),
        Some("zip" | "rar")
    )
}
