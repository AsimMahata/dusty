mod handlers;
mod printers;
mod scanners;
mod types;
use std::path::PathBuf;
use types::file_types::Files;

use printers::option::what_to_print;
use scanners::scanner::read_all_files;

fn main() {
    let path: PathBuf = PathBuf::from("C:\\Users\\asim\\Downloads\\Telegram Desktop");
    let mut files = Files::new();
    read_all_files(&mut files, path);
    what_to_print(&files);
}
