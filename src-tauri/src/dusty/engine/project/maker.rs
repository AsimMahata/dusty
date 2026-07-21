use std::path::PathBuf;

use crate::dusty::{data::project::Project, utility::sha256_hash::get_sha256_id};

pub fn make_project(path: &PathBuf) -> Project {
    let title: String = path
        .file_name()
        .expect("Failed to get file name from path")
        .to_string_lossy()
        .into_owned();
    let path_str = path.to_string_lossy().into_owned();

    let p: Project = Project {
        id: make_project_id_sha256(&path_str, &title),
        title: title,
        path: path_str,
        project_type: None,
        pinned: false,
        status: "default".to_string(),
        tags: Vec::new(),
        cover_image: None,
        logo: None,
        last_opened: None,
        last_modified: None,
        last_scan: None,
        description: None,
        size: None,
        git_info: None,
    };
    return p;
}

fn make_project_id_sha256(path_str: &String, title: &String) -> String {
    get_sha256_id(path_str.clone(), title.clone())
}
