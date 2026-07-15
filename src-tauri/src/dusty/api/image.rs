use std::path::PathBuf;
use mime_guess::mime;
use crate::dusty::data::file::FileInfo;
use crate::dusty::scanners::dfs::dfs_file_of_type;
use crate::dusty::utility::info::is_windows_root;

#[tauri::command]
pub fn scan_image(path: String) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);

    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::IMAGE, &mut list, is_windows_root(&root));

    list.into_iter()
        .filter_map(|path| match FileInfo::from_pathbuf(&path) {
            Ok(info) => Some(info),
            Err(err) => {
                eprintln!("{}: {}", path.display(), err);
                None
            }
        })
        .collect()
}
