use std::{collections::HashSet, fs, path::PathBuf};

use mime_guess::mime::Name;

use crate::{
    data::{project::Project, shows::Shows},
    engine::project::maker::make_project,
    scanners::show_scanner::scan_shows_in_dir,
    types::tree::Node,
    utility::info::{
        check_for_bad_sibling, get_file_type, is_forbidden_folder, is_git_repo, is_hidden,
    },
};

pub fn dfs_file_of_type(
    path: &PathBuf,
    type_: Name<'static>,
    list: &mut Vec<PathBuf>,
    is_root: bool,
) {
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
            if let Some(guess) = get_file_type(&child) {
                if guess == type_ {
                    list.push(child);
                }
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_file_of_type(&child, type_, list, false);
    }
}

pub fn dfs_show_scanner(path: &PathBuf, level: i32, shows: &mut Shows, is_root: bool) {
    if level > 50 {
        return;
    }

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

    scan_shows_in_dir(path, shows);

    //dfs
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
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_show_scanner(&child, level + 1, shows, false);
    }
}

pub fn dfs_tree_build(node: &mut Node) {
    // pass
    let entries = match fs::read_dir(node.get_name()) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", node.get_name(), e);
            return;
        }
    };
    for entry in entries {
        let child = entry.expect("something wrong with this child");
        if child
            .metadata()
            .expect("failed to retrieve metadata")
            .is_dir()
        {
            node.insert_child(Node::new(child.path()));
        } else {
            //     println!("Found a File Called {:?}", child);
            if let Some(format) = get_file_type(&child.path()) {
                node.insert_type(format);
            }
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
    // short circuit children
    node.short_circuit_children();
    // remove useless children
    node.check_disability();
}

pub fn dfs_project_scanner(path: &PathBuf, projects: &mut Vec<Project>, is_root: bool) {
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

    if is_git_repo(path) {
        projects.push(make_project(path));
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
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        }
    }

    for child in childrens {
        dfs_project_scanner(&child, projects, false);
    }
}
