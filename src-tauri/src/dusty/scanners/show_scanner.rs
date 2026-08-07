use std::path::PathBuf;

use mime_guess::mime;
use rusqlite::Connection;

use crate::dusty::{
    data::{
        shows::{ShowResult, ShowType, Shows},
        state::AppState,
    },
    db::{anime::Anime, tv_show::TvShow},
    engine::{
        cluster::cluster::cluster_files,
        shows::maker::{
            make_show_results_from_clusters, make_shows_from_clusters,
            make_shows_with_available_titles, TitleInfo,
        },
    },
    helpers::{anime::get_all_anime_titles, tv_show::get_all_tv_show_titles},
    scanners::{
        dfs::{dfs_file_of_type, dfs_show_scanner},
        videos::list_all_videos,
    },
    utility::info::is_root,
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

pub fn scan_for_shows_using_available_show_titles(
    db: &Connection,
    root: &PathBuf,
) -> Vec<ShowResult> {
    let mut videos: Vec<PathBuf> = Vec::new();
    dfs_file_of_type(&root, mime::VIDEO, &mut videos, is_root(&root));

    // done or not
    let mut done: Vec<bool> = vec![false; videos.len()];

    let mut titles: Vec<TitleInfo> = Vec::new();

    // Map anime titles
    for anime in get_all_anime_titles(db) {
        titles.push(TitleInfo {
            title: anime.title,
            show_id: anime.mal_id.to_string(),
            num_episodes: anime.num_episodes,
            season: anime.season,
            airing: anime.airing,
            show_type: ShowType::Anime,
        });
    }

    // Map tv_show titles
    for tv_show in get_all_tv_show_titles(db) {
        titles.push(TitleInfo {
            title: tv_show.title,
            show_id: tv_show.imdb_id,
            num_episodes: None,
            season: None,
            airing: false,
            show_type: ShowType::TvShow,
        });
    }

    let mut shows: Vec<ShowResult> = Vec::new();
    make_shows_with_available_titles(&videos, &titles, &mut done, &mut shows);

    let mut leftovers: Vec<PathBuf> = Vec::new();
    for (i, video) in videos.iter().enumerate() {
        if !done[i] {
            leftovers.push(video.clone());
        }
    }
    let clusters = cluster_files(&leftovers);
    make_show_results_from_clusters(&clusters, &mut shows);
    shows
}
