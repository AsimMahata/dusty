use std::path::PathBuf;

use mime_guess::mime;

use crate::dusty::filesystem::read::list_files_of_type;

pub fn list_all_videos(path: &PathBuf) -> Vec<PathBuf> {
    list_files_of_type(path, mime::VIDEO).unwrap_or_default()
}
