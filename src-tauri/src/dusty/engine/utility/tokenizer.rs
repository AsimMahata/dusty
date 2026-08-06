use regex::Regex;
use std::path::{self, PathBuf};
use std::sync::OnceLock;

static EPISODE_REGEX: OnceLock<Regex> = OnceLock::new();

//BUG:: TRIGUN BUG
const DELIMITERS: &[char] = &[
    ' ', '.', '_', '"', '-', '[', ']', '【', '】', '(', ')', '{', '}', ':', ';', '@', '｜', '|',
    '\\', '/', '$',
];
// const SPECIAL_CHARS: &[char] = &[];
const NOISY_TOKENS: &[&str] = &[
    "1080p", "amzn", "web", "dl", "english", "ddp2", "0", "japanese", "h", "264", "4khdhub", "com",
    "bd720p", "sub", "dual", "ep", "sub", "hdrip",
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
    // } else if t.contains(SPECIAL_CHARS) {
    //     return false;
    } else if is_noisy(&t.to_lowercase()) {
        return false;
    } else if t.chars().all(|c| c.is_ascii_digit()) {
        return false;
    } else {
        return true;
    }
}

fn is_token_valid_for_title(t: &str) -> bool {
    let regex =
        EPISODE_REGEX.get_or_init(|| Regex::new(r"^(?i)(e|ep|episode|epsode)\d*$").unwrap());

    if t.is_empty() {
        return false;
    } else if t.chars().all(|c| c.is_ascii_digit()) {
        return false;
    } else if is_noisy(&t.to_lowercase()) {
        return false;
    } else if t.len() <= 1 {
        return false;
    } else if regex.is_match(t) {
        return false;
    } else {
        return true;
    }
}

//TODO:: This parser is bad have to make custom which will go char by char like a automata

pub fn tokenize_file_name(path: &PathBuf) -> Vec<String> {
    path.file_stem()
        .and_then(|stem| stem.to_str())
        .map(|name| {
            name.split(|c| DELIMITERS.contains(&c)) // Cleanly references the constant
                .filter(|t| is_token_valid(t))
                .map(String::from)
                .map(|t| t.to_lowercase())
                .collect()
        })
        .unwrap_or_default()
}

pub fn tokenize_string(name: &str) -> Vec<String> {
    name.split(|c| DELIMITERS.contains(&c)) // Cleanly references the constant
        .filter(|t| is_token_valid_for_title(t))
        .map(String::from)
        .map(|t| t.to_lowercase())
        .collect()
}

pub fn tokenize_file_name_for_title_making(path: &PathBuf) -> Vec<String> {
    path.file_stem()
        .and_then(|stem| stem.to_str())
        .map(|name| {
            name.split(|c| DELIMITERS.contains(&c)) // Cleanly references the constant
                .filter(|t| is_token_valid_for_title(t))
                .map(String::from)
                .map(|t| t.to_lowercase())
                .collect()
        })
        .unwrap_or_default()
}

pub fn get_tokenized_file_names(files: &Vec<PathBuf>) -> Vec<Vec<String>> {
    let mut result: Vec<Vec<String>> = Vec::new();
    for file in files {
        result.push(tokenize_file_name(file));
    }
    return result;
}

pub fn get_tokenized_file_names_for_title_making(files: &Vec<PathBuf>) -> Vec<Vec<String>> {
    let mut result: Vec<Vec<String>> = Vec::new();
    for file in files {
        result.push(tokenize_file_name_for_title_making(file));
    }
    return result;
}
