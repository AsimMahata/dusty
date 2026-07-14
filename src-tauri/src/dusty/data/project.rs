use std::path::PathBuf;

use serde::Serialize;

#[derive(Serialize, Debug)]
pub enum ProjectType {
    React,
    Python,
    WebDev,
    Rust,
    Go,
    CPP,
    C,
    Unknown,
}

#[derive(Serialize, Debug)]
pub struct Project {
    pub title: String,
    pub path: PathBuf,
    pub project_type: ProjectType,
}
