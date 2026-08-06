use crate::dusty::system::git::{get_git_info_sys, GitInfo};

#[tauri::command]
pub fn get_git_info(path: String) -> GitInfo {
    get_git_info_sys(&path)
}
