use crate::dusty::db::anime::{Anime, get_all_anime_titles_in_db};
use rusqlite::Connection;

pub fn get_all_anime_titles(db:&Connection) -> Vec<Anime> {
    let cached:Vec<Anime> = get_all_anime_titles_in_db(db).unwrap_or_default();
    cached
}