use std::{fs, os::windows::prelude::*, path::PathBuf};

use crate::{
    data::shows::Shows,
    debug,
    engine::{cluster::cluster::cluster_files, shows::maker::make_shows_from_clusters},
    scanners::{dfs::dfs_show_scanner, videos::list_all_videos},
    utility::info::is_windows_root,
};
pub fn index_cluster_to_file_cluster(
    index_clusters: &Vec<Vec<i32>>,
    files: &Vec<PathBuf>,
) -> Vec<Vec<PathBuf>> {
    let mut clusters: Vec<Vec<PathBuf>> = Vec::new(); // cluster of shows
    for cluster_indices in index_clusters {
        let mut v: Vec<PathBuf> = Vec::new();
        for idx in cluster_indices {
            let val = files[idx.clone() as usize].clone();
            v.push(val);
        }
        clusters.push(v);
    }
    clusters
}
pub fn scan_shows_in_dir(path: &PathBuf, shows: &mut Shows) {
    let videos = list_all_videos(path);
    let index_clusters = cluster_files(&videos, 2);
    let clusters = index_cluster_to_file_cluster(&index_clusters, &videos);
    make_shows_from_clusters(&clusters, shows);
}

pub fn scan_for_shows(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    scan_shows_in_dir(path, &mut shows);
    debug!(shows);
}

pub fn scan_for_shows_rec(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    dfs_show_scanner(path, 0, &mut shows, is_windows_root(path));
    debug!(shows);
}
