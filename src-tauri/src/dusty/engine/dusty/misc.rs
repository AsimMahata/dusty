use std::path::PathBuf;

use crate::dusty::{
    data::file::FileInfo,
    filesystem::scan::{list_children, ScanOptions},
    utility::info::{get_all_valid_source_path, is_root},
};

pub fn list_misc_files(misc_type: &str) -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_misc_files_in_path(root, misc_type));
    }
    list
}

pub fn list_misc_files_in_path(path: PathBuf, misc_type: &str) -> Vec<FileInfo> {
    let mut files: Vec<FileInfo> = Vec::new();
    dfs_misc_scanner(&path, &mut files, is_root(&path), misc_type);
    files
}

fn dfs_misc_scanner(path: &PathBuf, files: &mut Vec<FileInfo>, is_root_path: bool, misc_type: &str) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in &children.files {
        if is_misc_file(file, misc_type) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                files.push(info);
            }
        }
    }
    for child in children.dirs {
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
