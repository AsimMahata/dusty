use crate::dusty::scanners::dfs::dfs_file_of_type;
use crate::dusty::utility::info::is_root;
use mime_guess::mime::Name;
use mime_guess::mime::{self};
use std::path::PathBuf;

fn get_file_of_type_rec(root_path: &PathBuf, type_: Name<'static>) -> Vec<PathBuf> {
    let mut list: Vec<PathBuf> = Vec::new();
    dfs_file_of_type(root_path, type_, &mut list, is_root(root_path));
    return list;
}

pub fn get_all_videos_rec(root_path: &PathBuf) -> Vec<PathBuf> {
    return get_file_of_type_rec(root_path, mime::VIDEO);
}
