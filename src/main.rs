#![allow(unused_imports)]
mod datastructures;
mod engine;
mod handlers;
mod printers;
mod scanners;
mod types;
mod utility;

use crate::engine::cluster::check_for_shows;
use crate::printers::option::what_to_print;
use crate::scanners::scanner::{build_file_tree, read_all_files};
use crate::types::file_types::Files;
use core::range;
use std::cmp::max;
use std::ops::{Add, Sub};
use std::path::PathBuf;
use std::result;

#[macro_export]
macro_rules! debug {
    ($($x:expr),*) => {
        $(
            println!("{:#?}", $x);
        )*
    };
}

fn main() {
    let path: PathBuf = PathBuf::from("C:\\Users\\asim\\Downloads\\Telegram Desktop");

    //chechking for shows
    check_for_shows(&path);

    // reading all files in a folder and putting inside files
    let mut files = Files::new();
    read_all_files(&mut files, &path);

    // building type tree
    let _tree = build_file_tree(path);
}
