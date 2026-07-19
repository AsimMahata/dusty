pub mod dusty;
use crate::dusty::db::init::init_db_and_os;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            dusty::api::file_system::read_dir,
            dusty::api::opener::open_file,
            dusty::api::show::scan_shows,
            dusty::api::show::rename_show,
            dusty::api::show::update_show_status,
            dusty::api::show::update_ban_status,
            dusty::api::show::update_pin_status,
            dusty::api::show::update_mal_id,
            dusty::api::show::reset_shows_table,
            dusty::api::project::scan_projects,
            dusty::api::project::update_project_pin_status,
            dusty::api::project::update_project_status,
            dusty::api::project::reset_project_table,
            dusty::api::media::get_media_of_type,
            dusty::api::media::sync_media_database,
            dusty::api::media::reset_media_cache_table,
            dusty::api::zip::scan_zip,
            dusty::api::empty_dir::scan_empty_dir,
            dusty::api::lab::tokenize,
            dusty::api::lab::get_all_table_data,
            dusty::api::settings::reset_database,
            dusty::api::mal::get_anime_info_from_mal,
            dusty::api::mal::update_anime_info_in_mal_cache,
            dusty::api::mal::add_anime_info_to_mal_cache,
            dusty::api::mal::reset_mal_cache,
            dusty::api::anime::get_seasonal_anime_with_info,
            dusty::api::anime::add_seasonal_anime_to_db,
            dusty::api::table::get_all_tables,
            dusty::api::table::reset_table,
            dusty::api::table::resync_table,
            dusty::api::system::get_system_info,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            init_db_and_os(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
