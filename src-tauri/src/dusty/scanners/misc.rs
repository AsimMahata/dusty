use std::path::PathBuf;

use crate::dusty::{
    data::{file::FileInfo, misc_dir::MiscDir},
    engine::dusty::misc::is_misc_file,
    filesystem::scan::{list_children, ScanOptions},
};

pub fn dfs_misc_dir_scanner(
    path: &PathBuf,
    misc_dirs: &mut Vec<MiscDir>,
    is_root: bool,
    misc_type: &str,
) -> Vec<MiscDir> {
    let mut has_match = false;
    let mut valid_child: Vec<MiscDir> = Vec::new();

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
        if is_misc_file(file, misc_type) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                files.push(info);
                has_match = true;
            }
        }
    }

    for child in children.dirs {
        valid_child.extend(dfs_misc_dir_scanner(&child, misc_dirs, false, misc_type));
    }

    if has_match || valid_child.len() > 2 {
        let mut dir = MiscDir::new(path.clone(), misc_type);
        let mut total_size: u64 = files.iter().map(|f| f.get_size()).sum();
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
            if let Some(child_size) = child_dir.size {
                total_size += child_size;
            }
        }
        dir.size = Some(total_size);
        dir.files.extend(files);
        misc_dirs.push(dir.clone());
        return vec![dir];
    }
    valid_child
}
