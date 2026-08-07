use std::path::PathBuf;

use mime_guess::mime;
use rusqlite::Connection;

use crate::dusty::{
    data::shows::{ShowResult, ShowType, Shows},
    engine::{
        cluster::cluster::cluster_files,
        shows::maker::{
            make_show_results_from_clusters, make_shows_from_clusters,
            make_shows_with_available_titles, TitleInfo,
        },
    },
    logger::logger,
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

pub fn get_all_linked_shows(db: &Connection) -> Vec<TitleInfo> {
    let mut stmt = match db.prepare("SELECT title, provider, provider_id, season, airing, show_type FROM shows WHERE provider IS NOT NULL") {
        Ok(s) => s,
        Err(err) => {
            logger::error!("PREPARE_GET_ALL_LINKED_SHOWS_FAILED", err);
            return Vec::new();
        }
    };

    let show_iter = match stmt.query_map([], |row| {
        let show_type_str: String = row.get(5)?;
        let provider: String = row.get(1)?;
        let provider_id: String = row.get(2)?;
        Ok(TitleInfo {
            title: row.get(0)?,
            provider,
            provider_id,
            num_episodes: None,
            season: row.get(3)?,
            airing: row.get::<_, i32>(4)? != 0,
            show_type: ShowType::from_str(&show_type_str),
        })
    }) {
        Ok(iter) => iter,
        Err(err) => {
            logger::error!("QUERY_GET_ALL_LINKED_SHOWS_FAILED", err);
            return Vec::new();
        }
    };

    let mut titles = Vec::new();
    for t in show_iter {
        if let Ok(title) = t {
            titles.push(title);
        }
    }
    titles
}

pub fn scan_for_shows_using_available_show_titles(
    db: &Connection,
    root: &PathBuf,
) -> Vec<ShowResult> {
    let mut videos: Vec<PathBuf> = Vec::new();
    dfs_file_of_type(&root, mime::VIDEO, &mut videos, is_root(&root));

    // done or not
    let mut done: Vec<bool> = vec![false; videos.len()];

    let titles: Vec<TitleInfo> = get_all_linked_shows(db);

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
