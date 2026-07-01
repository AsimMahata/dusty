use std::{
    fs,
    os::windows::fs::MetadataExt,
    path::PathBuf,
    time::{Duration, SystemTime},
};

use crate::utility::info::{check_for_bad_sibling, get_all_drives, is_forbidden_folder, is_hidden};

pub fn list_all_dusty_files() {
    let dusty_files: Vec<PathBuf> = scan_all_dusty_files();
}

fn scan_all_dusty_files() -> Vec<PathBuf> {
    let mut list: Vec<PathBuf> = Vec::new();
    for drive in get_all_drives() {
        dfs_dusty_files(&mut list, &drive, true);
    }
    return list;
}

fn dfs_dusty_files(list: &mut Vec<PathBuf>, path: &PathBuf, is_root: bool) {
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

    //dfs
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };
    let mut childrens: Vec<PathBuf> = Vec::new();
    let mut files: Vec<PathBuf> = Vec::new();
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            files.push(child);
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    //clear means ready to check

    for child in files {
        if is_dusty_file(&child) {
            list.push(path.clone());
            break;
        }
    }

    for child in childrens {
        dfs_dusty_files(list, &child, false);
    }
}

fn is_dusty_file(child: &PathBuf) -> bool {
    let metadata = child.metadata().expect("failed to get metadata");
    let six_months_ago = SystemTime::now() - Duration::from_secs(30 * 24 * 60 * 60);
    return metadata.len() > 5 * 1024 && metadata.created().unwrap() < six_months_ago;
}
