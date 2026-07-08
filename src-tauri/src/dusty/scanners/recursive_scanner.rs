use std::path::{self, PathBuf};

use mime_guess::mime::{self, Name};

use crate::dusty::{
    data::shows::Shows,
    engine::{cluster::cluster::cluster_files, shows::maker::make_shows_from_clusters},
    scanners::{dfs::dfs_file_of_type, show_scanner::index_cluster_to_file_cluster},
    utility::info::is_windows_root,
};

fn get_file_of_type_rec(root_path: &PathBuf, type_: Name<'static>) -> Vec<PathBuf> {
    let mut list: Vec<PathBuf> = Vec::new();
    dfs_file_of_type(root_path, type_, &mut list, is_windows_root(root_path));
    return list;
}

pub fn get_all_videos_rec(root_path: &PathBuf) -> Vec<PathBuf> {
    return get_file_of_type_rec(root_path, mime::VIDEO);
}

#[allow(dead_code)]
pub fn test_all_video_cluster(path: &PathBuf) {
    let list = get_all_videos_rec(path);
    let clusters = index_cluster_to_file_cluster(&cluster_files(&list, 2), &list);
    let mut shows: Shows = Shows::new();
    make_shows_from_clusters(&clusters, &mut shows, path);
}
