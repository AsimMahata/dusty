use std::{
    fs,
    path::{self, PathBuf},
};

use crate::{
    data::project::Project,
    scanners::dfs::dfs_project_scanner,
    utility::info::{get_all_drives, is_forbidden_folder, is_hidden},
};

pub fn scan_projects_in_drive(root: &PathBuf) -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    dfs_project_scanner(root, &mut projects, true);
    return projects;
}

pub fn scan_all_projects() {
    // scan in all drives
    let mut projects: Vec<Project> = Vec::new();
    for drive in get_all_drives() {
        projects.extend(scan_projects_in_drive(&drive));
    }
    dbg!(projects);
}
