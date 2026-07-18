use std::collections::HashMap;

use crate::dusty::{engine::{
    algo::rolling_hash::{get_common_token_order_using_rolling_hash, get_coupling_vec_using_rolling_hash}, cluster::helper::generate_token_id, utility::parser::{tokenize_file_name, tokenize_string},
}, logger::logger};

pub fn get_coupling_values(parsed_files: &Vec<Vec<String>>) -> Vec<Vec<f32>> {
    let n = parsed_files.len();
    let token_id: HashMap<String, i64> = generate_token_id(&parsed_files);
    let mut coupling: Vec<Vec<f32>> = vec![vec![0 as f32; n]; n];
    let max_window_size = 10;
    get_coupling_vec_using_rolling_hash(&mut coupling, &parsed_files, &token_id, max_window_size);
    coupling
}

pub fn get_coupling_value_between_anime_title_and_file_name(anime_title:String,file_name:String) ->f32{
    let mut coupling: Vec<Vec<f32>> = vec![vec![0 as f32; 2]; 2];
    let mut parsed_files: Vec<Vec<String>> = Vec::new();
    let s1_tokens = tokenize_string(&anime_title);
    let s2_tokens = tokenize_string(&file_name);
    let s2_tokens_cleaned:Vec<String> = s2_tokens.iter().filter(|token| is_valid_s2_token(&s1_tokens,token)).map(|token| token.to_string()).collect();
    parsed_files.push(s1_tokens);
    parsed_files.push(s2_tokens_cleaned);
    let token_id: HashMap<String, i64> = generate_token_id(&parsed_files);
    let max_window_size = 10;
    get_coupling_vec_using_rolling_hash(&mut coupling, &parsed_files, &token_id, max_window_size);
    let common:String = get_common_token_order_using_rolling_hash(&parsed_files);
    if coupling[0][1] > 0.5 {
        logger::info!("THRESHOLD_VALUE_REACHED: {:#?}",coupling[0][1]);
        logger::info!("FILES: {:#?}",&parsed_files);
        logger::info!("COMMON: {:#?}",common);
    }
    let common_tokens_count = common.split(" ").count();
    if common_tokens_count == 0 {
        return 0.0;
    }else if common_tokens_count == 1 {
        return coupling[0][1]*0.7;
    }
    return coupling[0][1];    
}

pub fn is_valid_s2_token(s1_tokens:&Vec<String>,token:&String)->bool{
    if token.len() == 0 {
        return false;
    }
    if s1_tokens.contains(&token) {
        return true;
    }
    return false;
}