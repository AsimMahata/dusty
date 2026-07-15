use crate::dusty::data::project::Project;
use crate::dusty::engine::project::scanner::scan_all_projects;

#[tauri::command]
pub fn scan_projects() -> Vec<Project> {
    let projects: Vec<Project> = scan_all_projects();
    return projects;
}
