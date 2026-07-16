pub mod dusty;
use crate::dusty::db::init::init_db;

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
            dusty::api::show::reset_shows_table,
            dusty::api::project::scan_projects,
            dusty::api::project::update_project_pin_status,
            dusty::api::project::update_project_status,
            dusty::api::project::reset_project_table,
            dusty::api::music::scan_music,
            dusty::api::video::scan_video,
            dusty::api::image::scan_image,
            dusty::api::zip::scan_zip,
            dusty::api::empty_dir::scan_empty_dir,
            dusty::api::lab::tokenize,
            dusty::api::settings::reset_database,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            init_db(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
