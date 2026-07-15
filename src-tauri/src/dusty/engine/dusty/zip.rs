use std::{cmp::Reverse, fs, path::PathBuf};

use crate::dusty::{
    data::file::FileInfo,
    scanners::dfs::dfs_file_of_type,
    utility::{
        info::{
            check_for_bad_sibling, get_all_valid_source_path, is_forbidden_folder, is_hidden,
            is_windows_root,
        },
        utility::format_size,
    },
};

pub fn list_large_zip_files() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for drive in get_all_valid_source_path() {
        list.extend(list_large_zip_files_in_path(drive));
    }
    return list;
}

pub fn list_large_zip_files_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut zips: Vec<FileInfo> = Vec::new();
    dfs_large_zip_scanner(&path, &mut zips, is_windows_root(&path));
    return zips;
}

fn dfs_large_zip_scanner(path: &PathBuf, zips: &mut Vec<FileInfo>, is_root: bool) {
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
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            if is_zip_file(&child) {
                let file = FileInfo::from_pathbuf(&child)
                    .expect("Crashed at zip.rs because cant get fileinfo for this file");
                zips.push(file);
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_large_zip_scanner(&child, zips, false);
    }
}

pub fn is_zip_file(path: &PathBuf) -> bool {
    matches!(
        path.extension().and_then(|e| e.to_str()),
        Some("zip" | "rar")
    )
}
