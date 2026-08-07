use std::{fs, path::PathBuf};
use crate::dusty::data::file::FileInfo;

use crate::dusty::{
    filesystem::{metadata, normalize},
    utility::info::{check_for_bad_sibling, is_forbidden_folder},
};

#[derive(Clone, Copy)]
pub struct ScanOptions {
    pub include_hidden: bool,
    pub skip_forbidden: bool,
    pub skip_bad_siblings: bool,
    pub is_root: bool,
    pub max_depth: Option<usize>,
}

impl Default for ScanOptions {
    fn default() -> Self {
        Self {
            include_hidden: false,
            skip_forbidden: true,
            skip_bad_siblings: true,
            is_root: false,
            max_depth: None,
        }
    }
}

pub struct DirChildren {
    pub dirs: Vec<PathBuf>,
    pub files: Vec<PathBuf>,
    pub total_count: usize,
    pub blocked: bool,
}

impl DirChildren {
    fn blocked_empty() -> Self {
        Self {
            dirs: vec![],
            files: vec![],
            total_count: 0,
            blocked: true,
        }
    }
}

pub fn list_children(path: &PathBuf, opts: &ScanOptions) -> DirChildren {
    if normalize::starts_with_dot(path) {
        return DirChildren::blocked_empty();
    }
    if !opts.is_root && !opts.include_hidden && metadata::is_hidden(path) {
        return DirChildren::blocked_empty();
    }
    if opts.skip_forbidden && is_forbidden_folder(path) {
        return DirChildren::blocked_empty();
    }

    let entries = match fs::read_dir(path) {
        Ok(e) => e,
        Err(_) => return DirChildren::blocked_empty(),
    };

    let mut dirs: Vec<PathBuf> = Vec::new();
    let mut files: Vec<PathBuf> = Vec::new();

    for entry in entries.flatten() {
        let child = entry.path();
        if child.is_dir() {
            dirs.push(child);
        } else {
            files.push(child);
        }
    }

    let total_count = dirs.len() + files.len();

    if opts.skip_bad_siblings && check_for_bad_sibling(&dirs) {
        return DirChildren {
            dirs: vec![],
            files: vec![],
            total_count,
            blocked: true,
        };
    }

    DirChildren {
        dirs,
        files,
        total_count,
        blocked: false,
    }
}

pub fn walk_dirs(path: &PathBuf, opts: &ScanOptions) -> Vec<PathBuf> {
    let children = list_children(path, opts);
    if children.blocked {
        return vec![];
    }
    let child_opts = ScanOptions {
        is_root: false,
        ..*opts
    };
    let mut result = children.dirs.clone();
    for dir in &children.dirs {
        result.extend(walk_dirs_inner(dir, &child_opts, 1, opts.max_depth));
    }
    result
}

fn walk_dirs_inner(
    path: &PathBuf,
    opts: &ScanOptions,
    depth: usize,
    max_depth: Option<usize>,
) -> Vec<PathBuf> {
    if let Some(max) = max_depth {
        if depth > max {
            return vec![];
        }
    }
    let children = list_children(path, opts);
    if children.blocked {
        return vec![];
    }
    let mut result = children.dirs.clone();
    for dir in &children.dirs {
        result.extend(walk_dirs_inner(dir, opts, depth + 1, max_depth));
    }
    result
}

pub fn walk_files(path: &PathBuf, opts: &ScanOptions) -> Vec<PathBuf> {
    let children = list_children(path, opts);
    if children.blocked {
        return vec![];
    }
    let child_opts = ScanOptions {
        is_root: false,
        ..*opts
    };
    let mut result = children.files.clone();
    for dir in &children.dirs {
        result.extend(walk_files_inner(dir, &child_opts, 1, opts.max_depth));
    }
    result
}

fn walk_files_inner(
    path: &PathBuf,
    opts: &ScanOptions,
    depth: usize,
    max_depth: Option<usize>,
) -> Vec<PathBuf> {
    if let Some(max) = max_depth {
        if depth > max {
            return vec![];
        }
    }
    let children = list_children(path, opts);
    if children.blocked {
        return vec![];
    }
    let mut result = children.files.clone();
    for dir in &children.dirs {
        result.extend(walk_files_inner(dir, opts, depth + 1, max_depth));
    }
    result
}

pub fn scan_dir(dir: &PathBuf) -> Vec<FileInfo> {
    crate::dusty::filesystem::read::list_raw(dir)
        .into_iter()
        .filter_map(|p| match FileInfo::from_pathbuf(&p) {
            Ok(info) => Some(info),
            Err(e) => {
                eprintln!("Failed to process {}: {}", p.display(), e);
                None
            }
        })
        .collect::<_>()
}
