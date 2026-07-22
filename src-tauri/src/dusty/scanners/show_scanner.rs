use std::path::PathBuf;

use mime_guess::mime;
use rusqlite::Connection;

use crate::dusty::{
    data::{
        file::FileInfo,
        shows::{ShowResult, Shows},
    },
    db::anime::{get_all_anime_titles_in_db, Anime},
    engine::{
        cluster::cluster::cluster_files,
        shows::maker::{
            generate_show_title, make_show_results_from_clusters, make_shows_from_clusters,
            make_shows_with_available_anime_titles,
        },
    },
    handlers::anime::get_all_anime_titles,
    scanners::{
        dfs::{dfs_file_of_type, dfs_show_scanner},
        videos::list_all_videos,
    },
    utility::{
        info::is_root,
        sha256_hash::{self, get_sha256_id},
    },
};

pub fn scan_shows_in_dir(path: &PathBuf, shows: &mut Shows) {
    let videos = list_all_videos(path);
    let clusters = cluster_files(&videos);
    make_shows_from_clusters(&clusters, shows, path);
}

pub fn scan_for_shows(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    scan_shows_in_dir(path, &mut shows);
}

pub fn scan_for_shows_rec(path: &PathBuf) -> Shows {
    let mut shows: Shows = Shows::new();
    dfs_show_scanner(path, 0, &mut shows, is_root(path));
    return shows;
}

pub fn scan_for_shows_with_seasons(db: &Connection, root: &PathBuf) -> Vec<ShowResult> {
    let mut videos: Vec<PathBuf> = Vec::new();
    dfs_file_of_type(&root, mime::VIDEO, &mut videos, is_root(&root));
    let titles: Vec<Anime> = get_all_anime_titles(db);
    if titles.len() == 0 {
        let clusters = cluster_files(&videos);
        let mut shows: Vec<ShowResult> = Vec::new();
        make_show_results_from_clusters(&clusters, &mut shows);
        return shows;
    }
    make_shows_with_available_anime_titles(&videos, &titles)
}
