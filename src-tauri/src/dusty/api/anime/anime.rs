use crate::dusty::data::state::AppState;
use crate::dusty::db::anime::{add_to_anime_in_db, get_all_anime_titles_in_db};
use crate::dusty::logger::logger;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct AnimeData {
    pub title: String,
    pub mal_id: i32,
    pub num_episodes: Option<u32>,
    pub season: Option<i32>,
    pub airing: bool,
}

#[tauri::command]
pub fn get_seasonal_anime_with_info(state: tauri::State<AppState>) -> Vec<AnimeData> {
    let db = state.db.lock().unwrap();
    let anime_list = get_all_anime_titles_in_db(&db).unwrap_or_default();

    anime_list
        .into_iter()
        .filter(|a| a.airing)
        .map(|a| AnimeData {
            title: a.title,
            mal_id: a.mal_id,
            num_episodes: a.num_episodes.map(|n| n as u32),
            season: a.season,
            airing: a.airing,
        })
        .collect()
}

#[tauri::command]
pub fn get_all_anime_from_db(state: tauri::State<AppState>) -> Vec<AnimeData> {
    let db = state.db.lock().unwrap();
    let anime_list = get_all_anime_titles_in_db(&db).unwrap_or_default();

    anime_list
        .into_iter()
        .map(|a| AnimeData {
            title: a.title,
            mal_id: a.mal_id,
            num_episodes: a.num_episodes.map(|n| n as u32),
            season: a.season,
            airing: a.airing,
        })
        .collect()
}

#[tauri::command]
pub fn add_seasonal_anime_to_db(state: tauri::State<AppState>, data: Vec<AnimeData>) -> bool {
    let db = state.db.lock().unwrap();
    let mut success = true;
    logger::info!("ADDING_SEASONAL_ANIME", data);
    for anime in data {
        if let Err(e) = add_to_anime_in_db(
            &db,
            anime.mal_id,
            anime.title.clone(),
            anime.num_episodes,
            anime.season,
            anime.airing,
        ) {
            logger::error!("FAILED_TO_ADD_SEASONAL_ANIME", e);
            success = false;
        } else {
            logger::info!("SUCCESSFULLY_ADDED_SEASONAL_ANIME", anime);
        }
    }

    success
}
