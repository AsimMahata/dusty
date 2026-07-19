use mime_guess::mime::Name;
use std::{fs, path::PathBuf};

use crate::dusty::{
    data::{file::FileInfo, media::MediaDir},
    utility::info::{check_for_bad_sibling, get_file_type, is_forbidden_folder, is_hidden},
};

pub fn dfs_media_dir_scanner(
    path: &PathBuf,
    media_dirs: &mut Vec<MediaDir>,
    is_root: bool,
    media_type_name: Name<'static>,
) -> Vec<MediaDir> {
    let mut has_media: bool = false;
    let mut valid_child: Vec<MediaDir> = Vec::new();

    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        println!("BAD_FOLDER found at {:?} SKIPPING ", path);
        return valid_child;
    };
    if !is_root && is_hidden(path) {
        println!("HIDDEN_FOLDER found at {:?} SKIPPING ", path);
        return valid_child;
    }
    if is_forbidden_folder(path) {
        println!("FORBIDDEN FOLDER found at {:?} SKIPPING", path);
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
    let mut media: Vec<FileInfo> = Vec::new();
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            if is_media(&child, &media_type_name) {
                if let Ok(info) = FileInfo::from_pathbuf(&child) {
                    media.push(info);
                    has_media = true;
                }
            }
        }
    }
    //Check for BAD_SIBLINGS
    if check_for_bad_sibling(&childrens) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return valid_child;
    }

    for child in childrens {
        valid_child.extend(dfs_media_dir_scanner(
            &child,
            media_dirs,
            false,
            media_type_name.clone(),
        ));
    }
    if has_media || valid_child.len() > 2 {
        let mut dir = MediaDir::new(
            path.to_string_lossy().to_string(),
            Some(media_type_name.as_str().to_string()),
        );
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
        }
        dir.media.extend(media.clone());
        media_dirs.push(dir.clone());
    }
    return valid_child;
}

fn is_media(path: &PathBuf, media_type_name: &Name<'static>) -> bool {
    if let Some(guess) = get_file_type(path) {
        return guess.eq(media_type_name);
    }
    return false;
}
