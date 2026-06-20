use std::{fs, os::windows::prelude::*, path::PathBuf};

use crate::{
    data::shows::Shows,
    debug,
    engine::{cluster::cluster::cluster_files, shows::maker::make_shows_from_clusters},
    scanners::{dfs::dfs_show_scanner, videos::list_all_videos},
};

pub fn scan_shows_in_dir(path: &PathBuf, shows: &mut Shows) {
    let videos = list_all_videos(path);
    let mut clusters: Vec<Vec<PathBuf>> = Vec::new(); // cluster of shows
    let local_clusters = cluster_files(&videos, 2);
    for cluster_indices in local_clusters {
        let mut v: Vec<PathBuf> = Vec::new();
        for idx in cluster_indices {
            let val = videos[idx as usize].clone();
            v.push(val);
        }
        clusters.push(v);
    }

    make_shows_from_clusters(&clusters, shows);
}

pub fn scan_for_shows(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    scan_shows_in_dir(path, &mut shows);
    debug!(shows);
}

pub fn scan_for_shows_rec(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    dfs_show_scanner(path, 0, &mut shows, path.eq(&PathBuf::from("C:\\")));
    debug!(shows);
}
