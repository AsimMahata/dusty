use std::path::PathBuf;

use crate::dusty::data::project::{Project, ProjectType};

pub fn make_project(path: &PathBuf) -> Project {
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
