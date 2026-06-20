use std::{fs, path::PathBuf};

use mime_guess::mime;

use crate::{
    handlers::{audio, default, image, video},
    types::file_types::Files,
};

pub fn read_all_files(files: &mut Files, path: &PathBuf) {
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
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
