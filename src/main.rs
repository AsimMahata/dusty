#![allow(unused_imports)]
mod handlers;
mod printers;
mod scanners;
mod types;

use crate::printers::option::what_to_print;
use crate::scanners::scanner::{build_file_tree, read_all_files};
use crate::types::file_types::Files;
use std::path::PathBuf;

fn main() {
    let path: PathBuf = PathBuf::from("C:\\Users\\asim\\Downloads\\Telegram Desktop");
    let mut files = Files::new();
    read_all_files(&mut files, &path);
    let tree = build_file_tree(path);
    //    what_to_print(&files);
    tree.print();
}
