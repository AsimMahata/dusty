use std::path::PathBuf;

use crate::dusty::types::file_types::Files;

pub fn video_handler(files: &mut Files, path: PathBuf) {
    if let Some(ext) = path.extension().expect("extension not found").to_str() {
        files.videos.entry(ext.to_string()).or_default().push(path);
    }
}
