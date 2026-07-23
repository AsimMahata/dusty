use std::{fs, path::PathBuf};

use crate::dusty::{
    data::file::FileInfo,
    utility::info::{
        check_for_bad_sibling, get_all_valid_source_path, is_forbidden_folder,
        is_hidden, is_root,
    },
};

pub fn list_pdfs() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_pdfs_in_path(root));
    }
    return list;
}

pub fn list_pdfs_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut pdfs: Vec<FileInfo> = Vec::new();
    dfs_pdfs_scanner(&path, &mut pdfs, is_root(&path));
    return pdfs;
}

fn dfs_pdfs_scanner(path: &PathBuf, pdfs: &mut Vec<FileInfo>, is_root: bool) {
    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        return;
    };
    if !is_root && is_hidden(path) {
        return;
    }
    if is_forbidden_folder(path) {
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
            if is_pdf_file(&child) {
                if let Ok(file) = FileInfo::from_pathbuf(&child) {
                    pdfs.push(file);
                }
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        return;
    }

    for child in childrens {
        dfs_pdfs_scanner(&child, pdfs, false);
    }
}

pub fn is_pdf_file(path: &PathBuf) -> bool {
    matches!(
        path.extension().and_then(|e| e.to_str()),
        Some("pdf")
    )
}
