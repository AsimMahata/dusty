use std::path::PathBuf;

use crate::dusty::{
    models::{exe::ExecutableDir, file::FileInfo},
    engine::dusty::exe::is_exe_file,
    filesystem::scan::{list_children, ScanOptions},
};

pub fn dfs_exe_dir_scanner(
    path: &PathBuf,
    exe_dirs: &mut Vec<ExecutableDir>,
    is_root: bool,
) -> Vec<ExecutableDir> {
    let mut has_exe = false;
    let mut valid_child: Vec<ExecutableDir> = Vec::new();

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
        if is_exe_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                files.push(info);
                has_exe = true;
            }
        }
    }

    for child in children.dirs {
        valid_child.extend(dfs_exe_dir_scanner(&child, exe_dirs, false));
    }

    if has_exe || valid_child.len() > 2 {
        let mut dir = ExecutableDir::new(path.clone());
        let mut total_size: u64 = files.iter().map(|f| f.get_size()).sum();
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
            if let Some(child_size) = child_dir.size {
                total_size += child_size;
            }
        }
        dir.size = Some(total_size);
        dir.files.extend(files);
        exe_dirs.push(dir.clone());
        return vec![dir];
    }
    valid_child
}
