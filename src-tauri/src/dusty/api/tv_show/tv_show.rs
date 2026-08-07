use crate::dusty::data::state::AppState;
use crate::dusty::db::tv_show::{add_to_tv_show_in_db, get_all_tv_show_titles_in_db};
use crate::dusty::logger::logger;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TvShowData {
    pub title: String,
    pub imdb_id: String,
    pub year: Option<i32>,
    pub image_url: Option<String>,
}

#[tauri::command]
pub fn get_all_tv_shows_from_db(state: tauri::State<AppState>) -> Vec<TvShowData> {
    let db = state.db.lock().unwrap();
    let tv_show_list = get_all_tv_show_titles_in_db(&db).unwrap_or_default();

    tv_show_list
        .into_iter()
        .map(|t| TvShowData {
            title: t.title,
            imdb_id: t.imdb_id,
            year: t.year,
            image_url: t.image_url,
        })
        .collect()
}

#[tauri::command]
pub fn add_seasonal_tv_show_to_db(state: tauri::State<AppState>, data: Vec<TvShowData>) -> bool {
    let db = state.db.lock().unwrap();
    let mut success = true;
    logger::info!("ADDING_SEASONAL_TV_SHOW", data);
    for tv_show in data {
        if let Err(e) = add_to_tv_show_in_db(
            &db,
            tv_show.imdb_id.clone(),
            tv_show.title.clone(),
            tv_show.year,
            tv_show.image_url.clone(),
        ) {
            logger::error!("FAILED_TO_ADD_SEASONAL_TV_SHOW", e);
            success = false;
        } else {
            logger::info!("SUCCESSFULLY_ADDED_SEASONAL_TV_SHOW", tv_show);
        }
    }

    success
}
