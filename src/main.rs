#![allow(unused_imports)]
mod data;
mod datastructures;
mod engine;
mod handlers;
mod printers;
mod scanners;
mod types;
mod utility;

use crate::data::file::FileInfo;
use crate::data::image::ImageDir;
use crate::data::shows::{Show, Shows};
use crate::engine::basket::basket::interface_put_in_basket;
use crate::engine::dusty::dusty::list_all_dusty_files;
use crate::engine::dusty::empty_dir::list_empty_dirs;
use crate::engine::dusty::image::list_image_dirs;
use crate::engine::dusty::zip::list_large_zip_files;
use crate::engine::utility::parser::tokenize_file_name;
use crate::printers::option::what_to_print;
use crate::scanners::project::scan_all_projects;
use crate::scanners::recursive_scanner::test_all_video_cluster;
use crate::scanners::show_scanner::scan_for_shows_rec;
use crate::scanners::tree_builder::build_file_tree;
use crate::types::file_types::Files;
use crate::utility::utility::format_size;
use core::range;
use std::cmp::{Reverse, max};
use std::fs::{self, File, create_dir};
use std::io::Write;
use std::iter::Empty;
use std::ops::{Add, Sub};
use std::path::{self, PathBuf};
use std::{env, io, result};

#[macro_export]
macro_rules! debug {
    ($($x:expr),*) => {
        $(
            println!("{:#?}", $x);
        )*
    };
}

fn run2() {
    let path: PathBuf = PathBuf::from("C:\\Users\\asim\\Downloads\\Telegram Desktop");
    let path2: PathBuf = PathBuf::from("C:\\");

    //chechking for shows
    debug!("--------------LET IT RIP---------------------");
    scan_for_shows_rec(&path2);
    debug!("--------------LET IT RIP---------------------");

    // building type tree
    let _tree = build_file_tree(path);
    // debug!(tokenize_file_name(&PathBuf::from(
    //     "C:\\Users\\asim\\Music\\Go-Offline\\done\\【original anime MV】美少女無罪♡パイレーツ【hololive⧸宝鐘マリン】.webm",
    // )));
    // // debug!(parse_file_name(&PathBuf::from(
    // //     "C:\\Users\\asim\\Music\\Go-Offline\\done\\Chand Sifarish ｜ Full Song ｜ Fanaa ｜ Aamir Khan, Kajol ｜ Shaan, Kailash Kher ｜ Jatin-Lalit ｜ Prasoon.webm"
    // // )));
    // let path = std::path::Path::new(
    //     r"C:\Users\asim\projects\Flow\node_modules\lucide-react\dist\lucide-react.suffixed.d.ts",
    // );
    // let guess = mime_guess::from_path(path);
    // println!("{:?}", guess.first());
}

use std::time::SystemTime;
fn test() {
    match SystemTime::now().duration_since(SystemTime::UNIX_EPOCH) {
        Ok(n) => println!("1970-01-01 00:00:00 UTC was {} seconds ago!", n.as_nanos()),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    }
}
fn run1() {
    let args: Vec<String> = env::args().collect();
    let path = &args[1];
    scan_for_shows_rec(&PathBuf::from(path));
    debug!(args);
}
fn run3() {
    scan_all_projects();
}

fn run4() {
    list_all_dusty_files();
}
fn run5() {
    interface_put_in_basket();
}
#[allow(unused_variables)]
fn run6() {
    let zip_files: Vec<FileInfo> = list_large_zip_files();
    let image_dirs: Vec<ImageDir> = list_image_dirs();
    let empty_dirs: Vec<PathBuf> = list_empty_dirs();
}

fn run() {
    run6();
}
fn main() {
    let start = std::time::Instant::now();
    run();
    let duration = start.elapsed();
    println!("Total time: {:?}", duration);
}
