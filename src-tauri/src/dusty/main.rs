use std::path::PathBuf;

use serde::Serialize;

use crate::dusty::scanners::show_scanner::scan_for_shows_rec;

#[tauri::command]
pub fn my_custom_command() -> String {
    println!("I was invoked from JavaScript!");
    return "Hello from Rust!".to_string();
}

#[derive(Serialize, Debug)]
pub struct ShowResult {
    pub title: String,
    pub num_episodes: usize,
    pub episodes: Vec<String>,
    pub dir: String,
}
#[tauri::command]
pub fn scan_shows(path: String) -> Vec<ShowResult> {
    let root = PathBuf::from(&path);
    let shows = scan_for_shows_rec(&root);
    shows
        .get_list_of_shows()
        .iter()
        .map(|s| ShowResult {
            title: s.get_title(),
            num_episodes: s.get_number_of_ep(),
            episodes: s
                .get_eps()
                .iter()
                .map(|p| p.to_string_lossy().into_owned())
                .collect(),
            dir: s.get_dir().to_string_lossy().into_owned(),
        })
        .collect()
}
