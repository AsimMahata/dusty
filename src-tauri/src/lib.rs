pub mod dusty;
use crate::dusty::db::init::init_db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            dusty::main::scan_shows,
            dusty::main::open_file,
            dusty::main::scan_projects,
            dusty::main::read_dir,
            dusty::main::scan_music,
            dusty::main::scan_video,
            dusty::main::scan_image,
            dusty::main::scan_zip,
            dusty::main::scan_empty_dir,
            dusty::main::ban_show,
            dusty::main::unban_show,
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
