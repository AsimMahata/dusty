use std::io;

use crate::types::file_types::Files;
#[allow(dead_code)]
pub fn what_to_print(files: &Files) {
    let mut buf = String::new();
    println!("1: Video \n2: Audio\n3: Images \n4: Others \n-1: Exit");
    if io::stdin().read_line(&mut buf).is_err() {
        println!("Failed to read input");
        return;
    }
    let num: i32 = match buf.trim().parse() {
        Ok(n) => n,
        Err(_) => {
            println!("Invalid input number");
            return;
        }
    };
    match num {
        1 => println!("{:#?}", files.videos),
        2 => println!("{:#?}", files.audios),
        3 => println!("{:#?}", files.images),
        4 => println!("{:#?}", files.others),
        -1 => println!("Exit"),
        _ => println!("Invalid choice"),
    }
}
