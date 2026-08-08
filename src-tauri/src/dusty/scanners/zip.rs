use std::path::PathBuf;

use crate::dusty::{
    data::{file::FileInfo, zip::ZipDir},
    engine::dusty::zip::is_zip_file,
    filesystem::scan::{list_children, ScanOptions},
};

pub fn dfs_zip_dir_scanner(
    path: &PathBuf,
    zip_dirs: &mut Vec<ZipDir>,
    is_root: bool,
) -> Vec<ZipDir> {
    let mut has_zip = false;
    let mut valid_child: Vec<ZipDir> = Vec::new();

    let opts = ScanOptions {
        is_root,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return valid_child;
    }

    let mut files: Vec<FileInfo> = Vec::new();
    for file in &children.files {
        if is_zip_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                files.push(info);
                has_zip = true;
            }
        }
    }

    for child in children.dirs {
        valid_child.extend(dfs_zip_dir_scanner(&child, zip_dirs, false));
    }

    if has_zip || valid_child.len() > 2 {
        let mut dir = ZipDir::new(path.clone());
        let mut total_size: u64 = files.iter().map(|f| f.get_size()).sum();
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
            if let Some(child_size) = child_dir.size {
                total_size += child_size;
            }
        }
        dir.size = Some(total_size);
        dir.files.extend(files);
        zip_dirs.push(dir.clone());
        return vec![dir];
    }
    valid_child
}
