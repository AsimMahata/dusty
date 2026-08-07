use std::{
    path::PathBuf,
    time::{Duration, SystemTime},
};

use crate::dusty::{
    filesystem::scan::{list_children, ScanOptions},
    utility::info::get_all_valid_source_path,
};

pub fn list_all_dusty_files() {
    let _dusty_files: Vec<PathBuf> = scan_all_dusty_files();
}

fn scan_all_dusty_files() -> Vec<PathBuf> {
    let mut list: Vec<PathBuf> = Vec::new();
    for drive in get_all_valid_source_path() {
        dfs_dusty_files(&mut list, &drive, true);
    }
    list
}

fn dfs_dusty_files(list: &mut Vec<PathBuf>, path: &PathBuf, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in &children.files {
        if is_dusty_file(file) {
            list.push(path.clone());
            break;
        }
    }
    for child in children.dirs {
        dfs_dusty_files(list, &child, false);
    }
}

fn is_dusty_file(child: &PathBuf) -> bool {
    let Ok(meta) = child.metadata() else { return false };
    let six_months_ago = SystemTime::now() - Duration::from_secs(30 * 24 * 60 * 60);
    meta.len() > 5 * 1024 && meta.created().map_or(false, |c| c < six_months_ago)
}
