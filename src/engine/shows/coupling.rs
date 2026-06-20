use std::collections::HashMap;

use crate::engine::{
    algo::rolling_hash::get_coupling_vec_using_rolling_hash, cluster::helper::generate_token_id,
};

pub fn get_coupling_values(parsed_files: &Vec<Vec<String>>) -> Vec<Vec<f32>> {
    let n = parsed_files.len();
    let token_id: HashMap<String, i64> = generate_token_id(&parsed_files);
    let mut coupling: Vec<Vec<f32>> = vec![vec![0 as f32; n]; n];
    let max_window_size = 10;
    get_coupling_vec_using_rolling_hash(&mut coupling, &parsed_files, &token_id, max_window_size);
    coupling
}
