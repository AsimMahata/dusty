#![allow(unused_imports)]
mod data;
mod datastructures;
mod engine;
mod handlers;
mod printers;
mod scanners;
mod types;
mod utility;

use crate::engine::utility::parser::tokenize_file_name;
use crate::printers::option::what_to_print;
use crate::scanners::show_scanner::scan_for_shows_rec;
use crate::scanners::tree_builder::build_file_tree;
use crate::types::file_types::Files;
use core::range;
use std::cmp::max;
use std::ops::{Add, Sub};
use std::path::{self, PathBuf};
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
    let start = std::time::Instant::now();
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

    let duration = start.elapsed();
    println!("Total time: {:?}", duration);
}
