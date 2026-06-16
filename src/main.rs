use mime_guess::{self, mime};
use std::{
    collections::HashMap,
    fs::{self},
    io,
    path::PathBuf,
};

pub type Data = HashMap<String, Vec<PathBuf>>;

pub struct Files {
    videos: Data,
    audios: Data,
    images: Data,
    others: Data,
}

impl Files {
    pub fn new() -> Self {
        Files {
            videos: HashMap::new(),
            audios: HashMap::new(),
            images: HashMap::new(),
            others: HashMap::new(),
        }
    }
}

fn video_handler(files: &mut Files, path: PathBuf) {
    if let Some(ext) = path.extension().expect("extension not found").to_str() {
        files.videos.entry(ext.to_string()).or_default().push(path);
    }
}

fn audio_handler(files: &mut Files, path: PathBuf) {
    if let Some(ext) = path.extension().expect("extension not found").to_str() {
        files.audios.entry(ext.to_string()).or_default().push(path);
    }
}

fn image_handler(files: &mut Files, path: PathBuf) {
    if let Some(ext) = path.extension().expect("extension not found").to_str() {
        files.images.entry(ext.to_string()).or_default().push(path);
    }
}

fn default_handler(files: &mut Files, path: PathBuf) {
    if let Some(ext) = path.extension().expect("extension not found").to_str() {
        files.others.entry(ext.to_string()).or_default().push(path);
    }
}

fn read_all_files(files: &mut Files, path: PathBuf) {
    println!("this is the path: {:#?}", path);
    let entries = fs::read_dir(&path).expect(&format!("failed to read directory {:?}", path));

    for entry in entries {
        let file_path = entry.expect("something wrong with this file").path();
        let guess = mime_guess::from_path(&file_path);

        match guess.first() {
            Some(m) => match m.type_() {
                mime::VIDEO => video_handler(files, file_path),
                mime::AUDIO => audio_handler(files, file_path),
                mime::IMAGE => image_handler(files, file_path),
                _ => default_handler(files, file_path),
            },
            _ => {}
        }
    }
}

fn what_to_print(files: &Files) {
    let mut buf = String::new();
    println!("1: Video \n2: Audio\n3: Images \n4: Others \n-1: Exit");
    io::stdin().read_line(&mut buf).expect("failed to read");
    let num: i32 = buf.trim().parse().expect("failed to parse");
    match num {
        1 => println!("{:#?}", files.videos),
        2 => println!("{:#?}", files.audios),
        3 => println!("{:#?}", files.images),
        4 => println!("{:#?}", files.others),
        -1 => println!("Exit"),
        _ => println!("Invalid choice"),
    }
}

fn main() {
    let path: PathBuf = PathBuf::from("C:\\Users\\asim\\Downloads");
    let mut files = Files::new();
    read_all_files(&mut files, path);
    what_to_print(&files);
}
