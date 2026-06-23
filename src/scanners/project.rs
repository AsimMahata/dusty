use std::{
    fs,
    path::{self, PathBuf},
};

use crate::utility::info::{is_forbidden_folder, is_hidden};

pub struct Age {
    year: usize,
    month: usize,
    day: usize,
    hour: usize,
}
#[derive(Debug)]
enum ProjectType {
    React,
    Python,
    WebDev,
    Rust,
    Go,
    CPP,
    C,
    Unknown,
}

#[derive(Debug)]
pub struct Project {
    title: String,
    path: PathBuf,
    project_type: ProjectType,
}

pub fn scan_projects_in_drive(root: &PathBuf) -> Vec<Project> {
    let mut projects: Vec<Project> = Vec::new();
    dfs_project_scanner(root, &mut projects, true);
    return projects;
}

fn dfs_project_scanner(path: &PathBuf, projects: &mut Vec<Project>, is_root: bool) {
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

fn make_project(path: &PathBuf) -> Project {
    let p: Project = Project {
        title: path
            .file_name()
            .expect("Failed to get file name from path")
            .to_string_lossy()
            .into_owned(),
        path: path.clone(),
        project_type: ProjectType::Unknown,
    };
    return p;
}

fn is_git_repo(path: &PathBuf) -> bool {
    path.join(".git").exists()
}
pub fn scan_all_projects() {
    // scan in all drives
    let mut projects: Vec<Project> = Vec::new();
    for drive in get_all_drives() {
        projects.extend(scan_projects_in_drive(&drive));
    }
    dbg!(projects);
}

fn get_all_drives() -> Vec<PathBuf> {
    let mut drives: Vec<PathBuf> = Vec::new();
    drives.push(PathBuf::from("C:\\"));
    return drives;
}
