use std::{
    fs,
    io::{self, Write},
    path::PathBuf,
};

use crate::{
    data::shows::{Show, Shows},
    scanners::show_scanner::scan_for_shows_rec,
};

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
pub fn interface_put_in_basket() {
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
