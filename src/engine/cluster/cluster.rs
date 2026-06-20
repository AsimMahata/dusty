use std::path::PathBuf;

use crate::engine::utility::parser::get_tokenized_file_names;
use crate::{
    engine::{
        algo::levenshtein::edit_dist_string_clusters, cluster::helper::cluster_indices_using_dsu,
        shows::coupling::get_coupling_values,
    },
    utility::utility::strip_folder_name_in_batch,
};

pub fn word_based_file_clusters(files: &Vec<PathBuf>) -> Vec<Vec<i32>> {
    let parsed_files = get_tokenized_file_names(files);
    let coupling = get_coupling_values(&parsed_files);
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
