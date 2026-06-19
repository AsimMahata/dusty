use std::path::PathBuf;

use crate::debug;

//BUG:: TRIGUN BUG
const DELIMITERS: &[char] = &[' ', '.', '_', '"', '-'];
const SPECIAL_CHARS: &[char] = &[
    '[', ']', '@', '｜', '|', '\\', '/', '$', '&', '(', ')', '{', '}',
];
const NOISY_TOKENS: &[&str] = &[
    "1080p", "AMZN", "WEB", "DL", "English", "DDP2", "0", "Japanese", "H", "264", "4kHdHub", "Com",
];

fn is_noisy(token: &str) -> bool {
    // Check the fast, hardcoded list first
    if NOISY_TOKENS.contains(&token) {
        return true;
    }
    // Check the dynamic pattern second
    false
}

fn is_token_valid(t: &str) -> bool {
    if t.is_empty() {
        return false;
    } else if t.contains(SPECIAL_CHARS) {
        return false;
    } else if is_noisy(&t) {
        return false;
    } else if t.chars().all(|c| c.is_ascii_digit()) {
        return false;
    } else {
        return true;
    }
}

//TODO:: This parser is bad have to make custom which will go char by char like a automata
pub fn parse_file_name(path: &PathBuf) -> Vec<String> {
    path.file_stem()
        .and_then(|stem| stem.to_str())
        .map(|name| {
            name.split(|c| DELIMITERS.contains(&c)) // Cleanly references the constant
                .filter(|t| is_token_valid(t))
                .map(String::from)
                .collect()
        })
        .unwrap_or_default()
}

pub fn get_parsed_files(files: &Vec<PathBuf>) -> Vec<Vec<String>> {
    let mut result: Vec<Vec<String>> = Vec::new();
    for file in files {
        result.push(parse_file_name(file));
    }
    return result;
}
