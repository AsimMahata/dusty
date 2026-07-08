use std::path::PathBuf;

pub struct Age {
    year: usize,
    month: usize,
    day: usize,
    hour: usize,
}
#[derive(Debug)]
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

#[derive(Debug)]
pub struct Project {
    pub title: String,
    pub path: PathBuf,
    pub project_type: ProjectType,
}
