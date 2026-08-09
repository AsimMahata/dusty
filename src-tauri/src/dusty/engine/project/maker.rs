use std::path::PathBuf;

use crate::dusty::{models::project::Project, utility::sha256_hash::get_sha256_id};

pub fn make_project(path: &PathBuf) -> Project {
    let title: String = path
        .file_name()
        .and_then(|n| n.to_str())
        .map(|s| s.to_string())
        .unwrap_or_else(|| path.to_str().unwrap_or("FAILED_TO_PARSE").to_string());
    let path_str = path.to_str().unwrap_or("FAILED_TO_PARSE").to_string();

    Project {
        id: make_project_id_sha256(&path_str, &title),
        title,
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
    }
}

fn make_project_id_sha256(path_str: &String, title: &String) -> String {
    get_sha256_id(path_str.clone(), title.clone())
}
