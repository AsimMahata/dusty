use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub path: String,
    pub project_type: String,
    pub pinned:bool,
    pub status: String,
}

#[derive(Serialize, Debug)]
pub struct ProjectInfo {
    pub project_type: String,
    pub pinned: bool,
    pub status: String,
}
