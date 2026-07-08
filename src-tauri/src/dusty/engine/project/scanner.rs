use std::{
    fs,
    path::{self, PathBuf},
};

use crate::dusty::{
    data::project::Project,
    engine::project::maker::make_project,
    utility::info::{get_all_drives, is_forbidden_folder, is_git_repo, is_hidden},
};

pub fn scan_projects_in_drive(root: &PathBuf) -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    dfs_project_scanner(root, &mut projects, true);
    return projects;
}

pub fn scan_all_projects() -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    for drive in get_all_drives() {
        projects.extend(scan_projects_in_drive(&drive));
    }
    return projects;
}
pub fn dfs_project_scanner(path: &PathBuf, projects: &mut Vec<Project>, is_root: bool) {
    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        return;
    };

    if !is_root && is_hidden(path) {
        return;
    }
    if is_forbidden_folder(path) {
        return;
    }

    if is_git_repo(path) {
        projects.push(make_project(path));
        return;
    }
    //dfs
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        _ => {
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
