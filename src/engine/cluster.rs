use std::{path::PathBuf, result};

use crate::{
    datastructures::dsu::Dsu,
    debug,
    engine::{
        cluster,
        levenshtein::{edit_dist_string_clusters, levenshtein_distance},
    },
    scanners::scanner::read_all_files,
    types::file_types::Files,
    utility::utility::strip_folder_name,
};

// new word based
// steps ::
// get rid of folder name and extension
// [Anime Time] Trigun (1998) (Season 01+Movie+OST) [BD] [Dual Audio] [576p][HEVC 10bit x265][AC3][Eng Sub]\\Trigun - Badlands Rumble"
// strip by space
// remove [] () {}
// To, Your, Eternity, S3, -, 16, Hdrip, Sub,

// Define the delimiters in one central spot
const DELIMITERS: &[char] = &[' ', '.', '_', '"', '-'];
const SPECIAL_CHARS: &[char] = &['[', ']', '@', '$', '&', '(', ')', '{', '}'];

fn word_is_valid(w: &str) -> bool {
    if w.is_empty() {
        return false;
    } else if w.contains(SPECIAL_CHARS) {
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
                .filter(|s| word_is_valid(s))
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
pub fn word_based_file_clusters(files: &Vec<PathBuf>) -> Vec<Vec<i32>> {
    let parsed_files = get_parsed_files(files);
    debug!(parsed_files);
    return Vec::new();
}

pub fn cluster_files(files: &Vec<PathBuf>, algo: i32) -> Vec<Vec<i32>> {
    match algo {
        1 => {
            return edit_dist_string_clusters(strip_folder_name(files));
        }
        2 => {
            return word_based_file_clusters(files);
        }
        _ => {
            return edit_dist_string_clusters(strip_folder_name(files));
        }
    }
}

pub fn check_for_shows(path: &PathBuf) {
    //WARN:: reading all files But only need videos
    let mut files = Files::new();
    read_all_files(&mut files, &path);

    let mut clusters: Vec<Vec<PathBuf>> = Vec::new(); // cluster of shows

    //BUG:: First Batch by extension but extension might be different optimized but wrong

    for batch in files.videos.values() {
        let local_clusters = cluster_files(&batch, 2);
        for cluster_indices in local_clusters {
            let mut v: Vec<PathBuf> = Vec::new();
            for idx in cluster_indices {
                let val = batch[idx as usize].clone();
                v.push(val);
            }
            clusters.push(v);
        }
    }
    println!("Final Clusters : {:#?}", clusters);
}
