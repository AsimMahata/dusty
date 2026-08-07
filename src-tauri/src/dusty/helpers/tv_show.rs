use crate::dusty::db::tv_show::{get_all_tv_show_titles_in_db, TvShow};
use rusqlite::Connection;

pub fn get_all_tv_show_titles(db: &Connection) -> Vec<TvShow> {
    get_all_tv_show_titles_in_db(db).unwrap_or_default()
}
