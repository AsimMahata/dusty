use std::{fs, path::PathBuf};

use crate::dusty::{
    data::file::FileInfo,
    utility::info::{
        check_for_bad_sibling, get_all_valid_source_path, is_forbidden_folder, is_hidden,
        is_root,
    },
};

pub fn list_misc_files(misc_type: &str) -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_misc_files_in_path(root, misc_type));
    }
    return list;
}

pub fn list_misc_files_in_path(path: PathBuf, misc_type: &str) -> Vec<FileInfo> {
    let mut files: Vec<FileInfo> = Vec::new();
    dfs_misc_scanner(&path, &mut files, is_root(&path), misc_type);
    return files;
}

fn dfs_misc_scanner(path: &PathBuf, files: &mut Vec<FileInfo>, is_root: bool, misc_type: &str) {
    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        println!("BAD_FOLDER found at {:?} SKIPPING ", path);
        return;
    };
    if !is_root && is_hidden(path) {
        println!("HIDDEN_FOLDER found at {:?} SKIPPING ", path);
        return;
    }
    if is_forbidden_folder(path) {
        println!("FORBIDDEN FOLDER found at {:?} SKIPPING", path);
        return;
    }
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };
    let mut childrens: Vec<PathBuf> = Vec::new();
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            if is_misc_file(&child, misc_type) {
                if let Ok(file) = FileInfo::from_pathbuf(&child) {
                    files.push(file);
                }
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_misc_scanner(&child, files, false, misc_type);
    }
}

pub fn is_misc_file(path: &PathBuf, misc_type: &str) -> bool {
    if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
        let ext_lower = ext.to_lowercase();
        return match misc_type {
            "exe" => ext_lower == "exe",
            "pdf" => ext_lower == "pdf",
            "zip" => ext_lower == "zip" || ext_lower == "rar",
            "json" => ext_lower == "json",
            "text" => ext_lower == "txt" || ext_lower == "text",
            "office" => matches!(ext_lower.as_str(), "doc" | "docx" | "xls" | "xlsx" | "ppt" | "pptx"),
            _ => false,
        };
    }
    false
}
