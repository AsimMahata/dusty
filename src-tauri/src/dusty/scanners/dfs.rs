use std::{collections::HashSet, path::PathBuf};

use mime_guess::mime::Name;

use crate::dusty::{
    models::{project::Project, shows::Shows},
    engine::project::maker::make_project,
    filesystem::scan::{list_children, ScanOptions},
    scanners::show_scanner::scan_shows_in_dir,
    utility::info::{get_file_type, is_git_repo},
};

pub fn dfs_file_of_type(
    path: &PathBuf,
    type_: Name<'static>,
    list: &mut Vec<PathBuf>,
    is_root: bool,
) {
    let opts = ScanOptions {
        is_root,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in children.files {
        if let Some(guess) = get_file_type(&file) {
            if guess == type_ {
                list.push(file);
            }
        }
    }
    for child in children.dirs {
        dfs_file_of_type(&child, type_, list, false);
    }
}

pub fn dfs_show_scanner(path: &PathBuf, level: i32, shows: &mut Shows, is_root: bool) {
    if level > 50 {
        return;
    }
    let opts = ScanOptions {
        is_root,
        max_depth: Some(50),
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    scan_shows_in_dir(path, shows);
    for dir in children.dirs {
        dfs_show_scanner(&dir, level + 1, shows, false);
    }
}