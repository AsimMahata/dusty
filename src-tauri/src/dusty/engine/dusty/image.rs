use std::{any::Any, cmp::Reverse, fs, path::PathBuf};

use mime_guess::mime;

use crate::dusty::{
    data::{
        file::FileInfo,
        image::{self, ImageDir},
    },
    utility::{
        info::{
            check_for_bad_sibling, get_all_drives, get_file_type, is_forbidden_folder, is_hidden,
            is_windows_root,
        },
        utility::format_size,
    },
};

pub fn list_image_dirs() -> Vec<ImageDir> {
    let mut list: Vec<ImageDir> = Vec::new();
    for drive in get_all_drives() {
        list.extend(list_image_dirs_in_drive(drive));
    }
    println!("List of Large Zip Files");
    let mut sorted_list: Vec<ImageDir> = list.clone();
    sorted_list.sort_unstable_by_key(|file| Reverse(file.get_size()));
    for item in sorted_list {
        println!(
            "File: {:#?} - Size: {}",
            item.get_path(),
            format_size(item.get_size())
        );
    }
    return list;
}

pub fn list_image_dirs_in_drive(path: PathBuf) -> Vec<ImageDir> {
    let mut image_dirs: Vec<ImageDir> = Vec::new();
    dfs_image_dir_scanner(&path, &mut image_dirs, is_windows_root(&path));
    return image_dirs;
}
pub fn dfs_image_dir_scanner(
    path: &PathBuf,
    image_dirs: &mut Vec<ImageDir>,
    is_root: bool,
) -> Vec<ImageDir> {
    let mut has_images: bool = false;
    let mut valid_child: Vec<ImageDir> = Vec::new();

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
    let mut images: Vec<FileInfo> = Vec::new();
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        } else {
            if is_image(&child) {
                if let Ok(image) = FileInfo::from_pathbuf(&child) {
                    images.push(image);
                    has_images = true;
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
        valid_child.extend(dfs_image_dir_scanner(&child, image_dirs, false));
    }
    if has_images || valid_child.len() > 2 {
        let mut dir: ImageDir = ImageDir::new(path.clone());
        for child_dir in &valid_child {
            dir.add_child(child_dir);
        }
        dir.add_images(&images);
        image_dirs.push(dir);
    }
    return valid_child;
}

fn is_image(path: &PathBuf) -> bool {
    if let Some(guess) = get_file_type(path) {
        return guess.eq(&mime::IMAGE);
    }
    return false;
}
