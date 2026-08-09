use std::path::PathBuf;

use crate::dusty::{
    models::{file::FileInfo, pdf::PdfDir},
    engine::dusty::pdf::is_pdf_file,
    filesystem::scan::{list_children, ScanOptions},
};

pub fn dfs_pdf_dir_scanner(
    path: &PathBuf,
    pdf_dirs: &mut Vec<PdfDir>,
    is_root: bool,
) -> Vec<PdfDir> {
    let mut has_pdf = false;
    let mut valid_child: Vec<PdfDir> = Vec::new();

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
        if is_pdf_file(file) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                files.push(info);
                has_pdf = true;
            }
        }
    }

    for child in children.dirs {
        valid_child.extend(dfs_pdf_dir_scanner(&child, pdf_dirs, false));
    }

    if has_pdf || valid_child.len() > 2 {
        let mut dir = PdfDir::new(path.clone());
        let mut total_size: u64 = files.iter().map(|f| f.get_size()).sum();
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
            if let Some(child_size) = child_dir.size {
                total_size += child_size;
            }
        }
        dir.size = Some(total_size);
        dir.files.extend(files);
        pdf_dirs.push(dir.clone());
        return vec![dir];
    }
    valid_child
}
