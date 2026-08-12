use std::path::PathBuf;

use crate::dusty::filesystem::scan::list_children;
use crate::dusty::filesystem::scan::ScanOptions;
use crate::dusty::models::file::FileInfo;
use crate::dusty::utility::info::get_all_valid_source_path;
use crate::dusty::utility::info::is_root;

pub fn list_pdfs() -> Vec<FileInfo> {
    let mut list: Vec<FileInfo> = Vec::new();
    for root in get_all_valid_source_path() {
        list.extend(list_pdfs_in_path(root));
    }
    list
}

pub fn list_pdfs_in_path(path: PathBuf) -> Vec<FileInfo> {
    let mut pdfs: Vec<FileInfo> = Vec::new();
    dfs_pdfs_scanner(&path, &mut pdfs, is_root(&path));
    pdfs
}

fn dfs_pdfs_scanner(path: &PathBuf, pdfs: &mut Vec<FileInfo>, is_root_path: bool) {
    let opts = ScanOptions {
        is_root: is_root_path,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return;
    }
    for file in &children.files {
        if is_pdf_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                pdfs.push(info);
            }
        }
    }
    for child in children.dirs {
        dfs_pdfs_scanner(&child, pdfs, false);
    }
}

pub fn is_pdf_file(path: &PathBuf) -> bool {
    matches!(path.extension().and_then(|e| e.to_str()), Some("pdf"))
}
