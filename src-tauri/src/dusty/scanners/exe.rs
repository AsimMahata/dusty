use std::{fs, path::PathBuf};

use crate::dusty::{
    data::{exe::ExecutableDir, file::FileInfo},
    engine::dusty::exe::is_exe_file,
    utility::info::{check_for_bad_sibling, is_forbidden_folder, is_hidden},
};

pub fn dfs_exe_dir_scanner(
    path: &PathBuf,
    exe_dirs: &mut Vec<ExecutableDir>,
    is_root: bool,
) -> Vec<ExecutableDir> {
    let mut has_exe: bool = false;
    let mut valid_child: Vec<ExecutableDir> = Vec::new();

    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        return valid_child;
    }
    if !is_root && is_hidden(path) {
        return valid_child;
    }
    if is_forbidden_folder(path) {
        return valid_child;
    }
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return valid_child;
        }
    };
    let mut childrens: Vec<PathBuf> = Vec::new();
    let mut files: Vec<FileInfo> = Vec::new();
    for entry in entries {
        if let Ok(e) = entry {
            let child = e.path();
            if child.is_dir() {
                childrens.push(child);
            } else {
                if is_exe_file(&child) {
                    if let Ok(info) = FileInfo::from_pathbuf(&child) {
                        files.push(info);
                        has_exe = true;
                    }
                }
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        return valid_child;
    }

    for child in childrens {
        valid_child.extend(dfs_exe_dir_scanner(&child, exe_dirs, false));
    }

    if has_exe || valid_child.len() > 2 {
        let mut dir = ExecutableDir::new(path.to_string_lossy().to_string());
        let mut total_size: u64 = files.iter().map(|f| f.get_size()).sum();

        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
            if let Some(child_size) = child_dir.size {
                total_size += child_size;
            }
        }
        dir.size = Some(total_size);
        dir.files.extend(files.clone());
        exe_dirs.push(dir.clone());
        return vec![dir];
    }

    return valid_child;
}
