use std::{collections::HashSet, path::PathBuf};

use mime_guess::mime::Name;

use crate::dusty::{
    data::{project::Project, shows::Shows},
    engine::project::maker::make_project,
    filesystem::scan::{list_children, ScanOptions},
    scanners::show_scanner::scan_shows_in_dir,
    types::tree::Node,
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

pub fn dfs_tree_build(node: &mut Node) {
    for child in crate::dusty::filesystem::read::list_raw(node.get_name()) {
        if child.is_dir() {
            node.insert_child(Node::new(child));
        } else if let Some(format) = get_file_type(&child) {
            node.insert_type(format);
        }
    }

    let mut all_types: HashSet<Name<'static>> = HashSet::new();
    for child in node.get_childs_mut() {
        dfs_tree_build(child);
        for t in child.get_types() {
            all_types.insert(t.clone());
        }
    }
    for t in all_types {
        node.insert_type(t);
    }
    node.short_circuit_children();
    node.check_disability();
}

pub fn dfs_project_scanner(path: &PathBuf, projects: &mut Vec<Project>, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    if is_git_repo(path) {
        projects.push(make_project(path));
        return;
    }
    for child in children.dirs {
        dfs_project_scanner(&child, projects, false);
    }
}
