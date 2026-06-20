use std::{fs, path::PathBuf};

use mime_guess::mime;

pub fn list_all_videos(path: &PathBuf) -> Vec<PathBuf> {
    let mut videos: Vec<PathBuf> = Vec::new();
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return Vec::new();
        }
    };

    for entry in entries {
        let file_path = entry.expect("something wrong with this file").path();
        let is_video = mime_guess::from_path(&file_path)
            .first()
            .map(|g| g.type_() == mime::VIDEO)
            .unwrap_or(false);
        if is_video {
            videos.push(file_path);
        }
    }
    videos
}
