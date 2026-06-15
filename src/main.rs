use mime_guess::{self};
use std::{
    collections::HashMap,
    fs::{self, DirEntry},
};

fn read_all_video_files(path: String) -> HashMap<String, Vec<DirEntry>> {
    let mut results: HashMap<String, Vec<DirEntry>> = HashMap::new();
    println!("this is the path: {:#?}", path);

    let entries = fs::read_dir(&path).expect(&format!("failed to read directory {}", path));

    for entry in entries {
        let dir_entry = entry.expect("something wrong with this file");

        let guess = mime_guess::from_path(dir_entry.path());
        match guess.first() {
            Some(m) => results
                .entry(m.type_().to_string())
                .or_default()
                .push(dir_entry),
            _ => {}
        }
    }

    return results;
}

fn main() {
    let path: String = String::from("C:\\Users\\asim\\Downloads\\Telegram Desktop");

    let results: HashMap<String, Vec<DirEntry>> = read_all_video_files(path);

    // Standard debug print
    println!("{:#?}", results);
}
