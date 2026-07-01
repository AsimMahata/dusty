#![allow(unused_imports)]
mod data;
mod datastructures;
mod engine;
mod handlers;
mod printers;
mod scanners;
mod types;
mod utility;

use crate::data::shows::{Show, Shows};
use crate::engine::dusty::dusty::list_all_dusty_files;
use crate::engine::utility::parser::tokenize_file_name;
use crate::printers::option::what_to_print;
use crate::scanners::project::scan_all_projects;
use crate::scanners::recursive_scanner::test_all_video_cluster;
use crate::scanners::show_scanner::scan_for_shows_rec;
use crate::scanners::tree_builder::build_file_tree;
use crate::types::file_types::Files;
use core::range;
use std::cmp::max;
use std::fs::{self, create_dir};
use std::io::Write;
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

fn check_for_other_sibling_show(show: &Show, shows: &Shows) -> bool {
    for other in shows.get_list_of_shows() {
        if other.get_title() == show.get_title() {
            continue;
        }
        if other.get_dir().eq(&show.get_dir()) {
            return true;
        }
    }
    return false;
}
fn move_file_to_directory(source_path: &PathBuf, mut target_dir: PathBuf) {
    // 1. Extract the file name from the source path
    // e.g., "my_show.mkv" from "downloads/my_show.mkv"
    if let Some(file_name) = source_path.file_name() {
        // 2. Push the file name onto your target directory PathBuf
        // e.g., target_dir becomes "shows/My Show/my_show.mkv"
        target_dir.push(file_name);

        // 3. Move the file using fs::rename
        match fs::rename(source_path, &target_dir) {
            Ok(_) => println!("Successfully moved file to {:?}", target_dir),
            Err(e) => {
                println!("Failed to move file!");
                dbg!(e);
            }
        }
    } else {
        println!("The source path does not point to a valid file name.");
    }
}
fn put_into_basket(show: &Show) {
    // create a directory
    // 1. Build your path
    let mut dir = show.get_dir();
    dir.push(show.get_title());

    // Note: create_dir_all is often better than create_dir because it builds parent folders if they are missing!
    let res = fs::create_dir_all(&dir);

    // 3. Handle the Result using `if let`
    if let Err(e) = res {
        println!("Failed to create directory!");
        dbg!(e);
    } else {
        // This acts as your "Ok" block
        println!("Directory created successfully at {:?}", dir);
    }
    for ep in show.get_eps() {
        move_file_to_directory(ep, dir.clone());
    }
}
fn interface_put_in_basket() {
    let path2: PathBuf = PathBuf::from("C:\\");
    let shows: Shows = scan_for_shows_rec(&path2);
    for show in shows.get_list_of_shows() {
        if check_for_other_sibling_show(show, &shows) == false {
            continue;
        }
        println!("---------------------------------------------------------------------");
        println!("{:#?}", show);
        print!("Do you want to process this show? (y / [Enter] for no / q to exit): ");
        io::stdout().flush().unwrap(); // Ensure the prompt prints before waiting for input

        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");

        let trimmed = input.trim();

        if trimmed == "q" {
            println!("Exiting loop...");
            break;
        } else if trimmed.eq_ignore_ascii_case("y") {
            println!("User selected: Yes");
            put_into_basket(show);
        } else if trimmed.is_empty() {
            println!("User selected: No (pressed Enter)");
        } else {
            println!("Unrecognized input. Please enter 'y', '-1', or just press Enter.");
        }
    }
}

fn run() {
    run5();
    test();
}
fn main() {
    let start = std::time::Instant::now();
    run();
    let duration = start.elapsed();
    println!("Total time: {:?}", duration);
}
