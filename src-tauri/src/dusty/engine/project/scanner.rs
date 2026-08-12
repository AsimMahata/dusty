use crate::dusty::engine::project::maker::make_project;
use crate::dusty::models::project::Project;
use crate::dusty::utility::info::get_all_valid_source_path;
use crate::dusty::utility::info::is_forbidden_folder;
use crate::dusty::utility::info::is_git_repo;
use crate::dusty::utility::info::is_hidden;
use crate::dusty::utility::info::is_root;
use std::fs;
use std::path::PathBuf;

pub fn scan_projects_in_path(source: &PathBuf) -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    dfs_project_scanner(source, &mut projects, is_root(source));
    return projects;
}

pub fn scan_all_projects() -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    for source in get_all_valid_source_path() {
        projects.extend(scan_projects_in_path(&source));
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
        if let Ok(entry) = entry {
            let child = entry.path();
            if child.is_dir() {
                childrens.push(child);
            }
        }
    }

    for child in childrens {
        dfs_project_scanner(&child, projects, false);
    }
}
