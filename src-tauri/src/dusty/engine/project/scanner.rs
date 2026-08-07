use std::path::PathBuf;

use crate::dusty::{
    data::project::Project,
    scanners::dfs::dfs_project_scanner,
    utility::info::{get_all_valid_source_path, is_root},
};

pub fn scan_projects_in_path(source: &PathBuf) -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    dfs_project_scanner(source, &mut projects, is_root(source));
    projects
}

pub fn scan_all_projects() -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    for source in get_all_valid_source_path() {
        projects.extend(scan_projects_in_path(&source));
    }
    projects
}
