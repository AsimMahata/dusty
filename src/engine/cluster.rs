use core::time;
use std::{
    collections::HashMap,
    ffi::OsStr,
    fs,
    ops::Sub,
    path::{self, PathBuf},
    result, vec,
};

use crate::{
    data::shows::{Show, Shows},
    datastructures::dsu::Dsu,
    debug,
    engine::{
        cluster,
        levenshtein::{edit_dist_string_clusters, levenshtein_distance},
        parser::get_parsed_files,
    },
    handlers::video,
    scanners::scanner::{list_all_videos, read_all_files},
    types::file_types::Files,
    utility::utility::{strip_folder_name, strip_folder_name_in_batch},
};
#[allow(unused_macros)]
macro_rules! print_grid {
    ($grid:expr) => {
        for row in &$grid {
            for element in row {
                // Adjust ":4" to change column width
                print!("{:4} ", element);
            }
            println!();
        }
    };
}
pub fn binary_exp_with_mod(a: i64, b: i64, m: i64) -> i64 {
    let mut res: i64 = 1;
    let mut p = b;
    let mut base = a;
    while p > 0 {
        if p % 2 == 1 {
            res = res * base % m;
        }
        p = p >> 1;
        base = base * base % m;
    }
    return res;
}
pub fn check_coupling(
    coupling: &mut Vec<Vec<f32>>,
    parsed_files: &Vec<Vec<String>>,
    token_id: &HashMap<String, i64>,
    k: usize,
) {
    // rolling hash
    let n = parsed_files.len();
    let p: i64 = 357;
    let m: i64 = 1e9 as i64 + 7;
    let mut p_pow: Vec<i64> = vec![1; p as usize];
    for i in 1..p as usize {
        p_pow[i] = (p * p_pow[i - 1]) % m;
    }

    let mut p_pow_inv: Vec<i64> = vec![1; p as usize];

    p_pow_inv[p as usize - 1] = binary_exp_with_mod(p_pow[p as usize - 1], m - 2, m);

    for i in (0..p - 1).rev() {
        p_pow_inv[i as usize] = (p_pow_inv[i as usize + 1] * p) % m;
    }

    let mut hash_frequency: HashMap<i64, Vec<usize>> = HashMap::new();
    for idx in 0..n {
        let tokens = &parsed_files[idx];
        if tokens.len() < k {
            continue;
        }
        let mut hash_value: Vec<i64> = vec![1; tokens.len()];
        for i in 0..k {
            let token_val = token_id.get(&tokens[i]).expect("crash at hashing");
            let prev = if i > 0 { hash_value[i - 1] } else { 0 };
            hash_value[i] = (prev + p_pow[i] * token_val) % m;
        }
        hash_frequency
            .entry(hash_value[k - 1])
            .or_default()
            .push(idx);

        for i in k..tokens.len() {
            let token_val = token_id.get(&tokens[i]).expect("crash at hashing");

            let prev = if i > 0 { hash_value[i - 1] } else { 0 };
            hash_value[i] = (prev + p_pow[i] * token_val) % m;

            let mut normalized_hash_value = (hash_value[i] - hash_value[i - k] + m) % m;
            normalized_hash_value = (normalized_hash_value * p_pow_inv[i - k]) % m;

            hash_frequency
                .entry(normalized_hash_value)
                .or_default()
                .push(idx);
        }
    }
    for idx in hash_frequency.values() {
        for i in 0..idx.len() {
            for j in i + 1..idx.len() {
                let a = parsed_files[idx[i]].len();
                let b = parsed_files[idx[j]].len();
                let to_add: f32 = (k as f32 * 2.0) / (a + b) as f32;
                coupling[idx[i]][idx[j]] += to_add;
            }
        }
    }
}
pub fn generate_token_id(parsed_files: &Vec<Vec<String>>) -> HashMap<String, i64> {
    let mut token_id: HashMap<String, i64> = HashMap::new();
    let mut count = 33;

    for tokens in parsed_files {
        for token in tokens {
            token_id.entry(token.clone()).or_insert(count);
            count += 1;
        }
    }
    token_id
}

pub fn cluster_indices_using_dsu(coupling: &Vec<Vec<f32>>) -> Vec<Vec<i32>> {
    let n = coupling.len();
    let threshold = 1.0;
    let mut dsu: Dsu = Dsu::new(n);
    dsu.init();
    for i in 0..n {
        for j in i + 1..n {
            let dist = coupling[i][j];
            if dist > threshold {
                dsu.union_set(i as i32, j as i32);
            }
        }
    }
    return dsu.get_index_clusters();
}

pub fn word_based_file_clusters(files: &Vec<PathBuf>) -> Vec<Vec<i32>> {
    let parsed_files = get_parsed_files(files);
    let n = parsed_files.len();
    let token_id: HashMap<String, i64> = generate_token_id(&parsed_files);
    let mut coupling: Vec<Vec<f32>> = vec![vec![0 as f32; n]; n];
    for k in 1..10 as usize {
        check_coupling(&mut coupling, &parsed_files, &token_id, k);
    }
    return cluster_indices_using_dsu(&coupling);
}

pub fn cluster_files(files: &Vec<PathBuf>, algo: i32) -> Vec<Vec<i32>> {
    match algo {
        1 => {
            return edit_dist_string_clusters(strip_folder_name_in_batch(files));
        }
        2 => {
            return word_based_file_clusters(files);
        }
        _ => {
            return edit_dist_string_clusters(strip_folder_name_in_batch(files));
        }
    }
}

fn generate_show_title(cluster: &Vec<PathBuf>) -> String {
    if let Some(first_video) = cluster.first() {
        if let Some(title) = strip_folder_name(first_video) {
            return title;
        }
    }
    return "UNKNOWN".to_string();
}
pub fn make_shows_from_clusters(clusters: &Vec<Vec<PathBuf>>, shows: &mut Shows) {
    for cluster in clusters {
        if cluster.len() < 2 {
            continue;
        }
        let title = generate_show_title(cluster);
        let season: Option<i32> = None;
        let num_of_ep: i32 = cluster.len() as i32;
        let start_ep: Option<i32> = None;
        let end_ep: Option<i32> = None;
        let show = Show::new(title, season, num_of_ep, start_ep, end_ep, cluster.clone());
        shows.insert_new_show(show);
    }
}

pub fn scan_shows_in_dir(path: &PathBuf, shows: &mut Shows) {
    let videos = list_all_videos(path);
    let mut clusters: Vec<Vec<PathBuf>> = Vec::new(); // cluster of shows
    let local_clusters = cluster_files(&videos, 2);
    for cluster_indices in local_clusters {
        let mut v: Vec<PathBuf> = Vec::new();
        for idx in cluster_indices {
            let val = videos[idx as usize].clone();
            v.push(val);
        }
        clusters.push(v);
    }

    make_shows_from_clusters(&clusters, shows);
}
const BAD_SIBLINGS: &[&str] = &[".git", "node_modules", ".venv", "venv", ".cph"];
const BAD_FOLDER: &[&str] = &["$AppData"];
use std::os::windows::prelude::*;

pub fn is_hidden(file_path: &std::path::PathBuf) -> bool {
    let metadata = fs::metadata(file_path).expect("Some Erorr Reading metadata");
    let attributes = metadata.file_attributes();

    (attributes & 0x2) > 0
}

fn dfs_show_scanner(path: &PathBuf, level: i32, shows: &mut Shows) {
    if level > 50 {
        return;
    }

    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
    {
        println!("BAD_FOLDER found at {:?} SKIPPING ", path);
        return;
    };
    if is_hidden(path) {
        println!("HIDDEN_FOLDER found at {:?} SKIPPING ", path);
        return;
    }
    scan_shows_in_dir(path, shows);

    //dfs
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };
    let mut childrens: Vec<PathBuf> = Vec::new();
    for entry in entries {
        let child = entry.expect("something wrong with this child").path();
        if child.is_dir() {
            childrens.push(child);
        }
    }
    //Check for BAD_SIBLINGS
    if childrens.iter().any(|c| {
        c.file_name()
            .and_then(|n| n.to_str())
            .map_or(false, |s| BAD_SIBLINGS.contains(&s))
    }) {
        println!("BAD_SIBLINGS found at {:?} SKIPPING ", path);
        return;
    }

    for child in childrens {
        dfs_show_scanner(&child, level + 1, shows);
    }
}

pub fn scan_for_shows(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    scan_shows_in_dir(path, &mut shows);
    debug!(shows);
}

pub fn scan_for_shows_rec(path: &PathBuf) {
    let mut shows: Shows = Shows::new();
    dfs_show_scanner(path, 0, &mut shows);
    debug!(shows);
}
