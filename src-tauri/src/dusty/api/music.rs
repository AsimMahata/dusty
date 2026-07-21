use crate::dusty::data::file::FileInfo;
use crate::dusty::data::state::AppState;
use crate::dusty::logger::logger;
use crate::dusty::scanners::dfs::dfs_file_of_type;
use crate::dusty::utility::info::is_root;
use crate::dusty::utility::sha256_hash::get_sha256_id;
use mime_guess::mime;
use rusqlite::{params, Connection};
use std::path::PathBuf;

#[tauri::command]
pub fn scan_music(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_music_using_cache(&state, &path, true)
}

#[tauri::command]
pub fn sync_scan_music(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_music_using_cache(&state, &path, false)
}

pub fn scan_music_using_cache(
    state: &tauri::State<AppState>,
    path: &String,
    cache: bool,
) -> Vec<FileInfo> {
    let root = PathBuf::from(&path);
    let db = state.db.lock().unwrap();
    if cache {
        if let Some(cached_music) = get_cached_music_from_media_cache_db(&db, path) {
            logger::info!("MUSIC_CACHE_LOADED", cached_music.len());
            if !cached_music.is_empty() {
                logger::info!("MUSIC_CACHE_NOT_EMPTY", cached_music.len());
                return cached_music;
            }
            logger::info!("MUSIC_CACHE_IS_EMPTY", cached_music.len());
        }
    }
    let mut list = Vec::new();
    dfs_file_of_type(&root, mime::AUDIO, &mut list, is_root(&root));
    logger::info!("media found", list.len());

    let file_info_list = list
        .into_iter()
        .filter_map(|path| match FileInfo::from_pathbuf(&path) {
            Ok(info) => Some(info),
            Err(err) => {
                eprintln!("{}: {}", path.display(), err);
                None
            }
        })
        .collect();

    add_music_in_media_cache_table(&db, path, &file_info_list)
        .map_err(|err| {
            logger::warning!("ADD_MUSIC_IN_CACHE_ERROR", err);
        })
        .ok();
    return file_info_list;
}

#[tauri::command]
pub fn scan_music_cached(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_music_using_cache(&state, &path, true)
}

#[tauri::command]
pub fn scan_music_no_cache(state: tauri::State<AppState>, path: String) -> Vec<FileInfo> {
    scan_music_using_cache(&state, &path, false)
}

fn get_cached_music_from_media_cache_db(db: &Connection, path: &String) -> Option<Vec<FileInfo>> {
    let id = get_sha256_id(path.clone(), "flat_music".to_string());
    let data = db
        .query_row(
            "SELECT data FROM media_cache WHERE id=?1",
            params![id],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();

    let data_json: Result<Vec<FileInfo>, _> = serde_json::from_str(&data);
    data_json.ok()
}

pub fn add_music_in_media_cache_table(
    db: &Connection,
    path: &String,
    musics: &Vec<FileInfo>,
) -> Result<(), String> {
    let id = get_sha256_id(path.clone(), "flat_music".to_string());
    let data: String = serde_json::to_string(&musics).unwrap_or_default();
    db.execute(
        "INSERT OR REPLACE INTO media_cache(id, source, media_type, data) VALUES (?1, ?2, ?3, ?4)",
        params![id, path, "flat_music", data],
    )
    .map_err(|err| err.to_string())?;

    Ok(())
}
