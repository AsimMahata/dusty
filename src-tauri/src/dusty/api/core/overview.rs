use rusqlite::{params, Connection};

use crate::dusty::{data::state::AppState, error::DustyError, logger::logger};

#[derive(serde::Serialize)]
pub struct Stats {
    pub shows: Option<usize>,
    pub projects: Option<usize>,
    pub songs: Option<usize>,
    pub videos: Option<usize>,
    pub images: Option<usize>,
    pub zips: Option<usize>,
    pub pdfs: Option<usize>,
    pub empty_dir: Option<usize>,
}

#[tauri::command]
pub fn get_stats(state: tauri::State<AppState>) -> Result<Stats, String> {
    let db = state.db.lock().map_err(|_| {
        let err = DustyError::lock("get_stats");
        logger::error!("DB_LOCK_FAILED", err.log_details());
        err.to_user_message()
    })?;
    Ok(Stats {
        shows: get_show_stats(&db),
        projects: get_project_stats(&db),
        songs: get_song_stats(&db),
        videos: get_video_stats(&db),
        images: get_image_stats(&db),
        zips: get_zip_stats(&db),
        pdfs: get_pdf_stats(&db),
        empty_dir: get_empty_dir_stats(&db),
    })
}

pub fn get_show_stats(db: &Connection) -> Option<usize> {
    db.query_row(
        "SELECT COUNT(*) FROM shows WHERE status!=?1 ",
        params!["banned".to_string()],
        |row| row.get(0),
    )
    .ok()
}

pub fn get_project_stats(db: &Connection) -> Option<usize> {
    db.query_row("SELECT COUNT(*) FROM projects", [], |row| row.get(0)).ok()
}

fn get_flat_media_stats(db: &Connection, media_type: &str) -> Option<usize> {
    let mut stmt = db
        .prepare("SELECT data FROM media_cache WHERE media_type=?1")
        .ok()?;
    let rows = stmt
        .query_map(params![media_type], |row| row.get::<_, String>(0))
        .ok()?;

    let mut total = 0;
    for data in rows {
        if let Ok(val) = data {
            if let Ok(data_json) = serde_json::from_str::<Vec<serde_json::Value>>(&val) {
                total += data_json.len();
            }
        }
    }
    Some(total)
}

pub fn get_song_stats(db: &Connection) -> Option<usize> {
    get_flat_media_stats(db, "flat_music")
}

pub fn get_video_stats(db: &Connection) -> Option<usize> {
    get_flat_media_stats(db, "flat_video")
}

pub fn get_image_stats(db: &Connection) -> Option<usize> {
    get_flat_media_stats(db, "flat_image")
}

pub fn get_zip_stats(db: &Connection) -> Option<usize> {
    db.query_row("SELECT COUNT(*) FROM misc_cache WHERE misc_type = 'zip'", [], |row| row.get(0)).ok()
}

pub fn get_pdf_stats(db: &Connection) -> Option<usize> {
    db.query_row("SELECT COUNT(*) FROM misc_cache WHERE misc_type = 'pdf'", [], |row| row.get(0)).ok()
}

pub fn get_empty_dir_stats(db: &Connection) -> Option<usize> {
    db.query_row("SELECT COUNT(*) FROM empty_dir_cache", [], |row| row.get(0)).ok()
}
