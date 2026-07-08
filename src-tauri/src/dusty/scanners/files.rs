use std::{fs, path::PathBuf};

use mime_guess::mime;

use crate::dusty::data::file::FileInfo;
use crate::dusty::handlers::{audio, default, image, video};
use crate::dusty::types::file_types::Files;

pub fn read_all_files(files: &mut Files, path: &PathBuf) {
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        _ => {
            return;
        }
    };

    for entry in entries {
        let file_path = entry.expect("something wrong with this file").path();
        let guess = mime_guess::from_path(&file_path);

        match guess.first() {
            Some(m) => match m.type_() {
                mime::VIDEO => video::video_handler(files, file_path),
                mime::AUDIO => audio::audio_handler(files, file_path),
                mime::IMAGE => image::image_handler(files, file_path),
                _ => default::default_handler(files, file_path),
            },
            _ => {}
        }
    }
}

pub fn scan_dir(dir: &PathBuf) -> Vec<FileInfo> {
    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(_) => return Vec::new(),
    };

    entries
        .filter_map(|entry| {
            entry
                .ok()
                .and_then(|e| match FileInfo::from_pathbuf(&e.path()) {
                    Ok(info) => Some(info),
                    Err(err) => {
                        eprintln!("Failed to process {}: {}", e.path().display(), err);
                        None
                    }
                })
        })
        .collect()
}
