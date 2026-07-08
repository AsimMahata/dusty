use std::collections::{HashMap, HashSet};

use crate::dusty::engine::{
    cluster::helper::generate_token_id,
    utility::{
        calculations::{get_prime_power, PrimePower},
        math::binary_exp_with_mod,
    },
};
pub fn get_hash_indices(
    tokenized_file_names: &Vec<Vec<String>>,
    hash_indices: &mut HashMap<i64, HashSet<usize>>,
    token_id: &HashMap<String, i64>,
    window_size: usize,
    common_tokens_in_order: &mut Vec<String>,
) {
    #[allow(unused_variables)]
    let PrimePower {
        p_pow,
        p_pow_inv,
        p,
        m,
    }: &PrimePower = get_prime_power();

    for idx in 0..tokenized_file_names.len() {
        let tokens = &tokenized_file_names[idx];
        if tokens.len() < window_size {
            continue;
        }
        let mut hash_value: Vec<i64> = vec![1; tokens.len()];

        for i in 0..window_size {
            let token_val = token_id.get(&tokens[i]).expect("crash at hashing");
            let prev = if i > 0 { hash_value[i - 1] } else { 0 };
            hash_value[i] = (prev + p_pow[i] * token_val) % m;
        }

        hash_indices
            .entry(hash_value[window_size - 1])
            .or_default()
            .insert(idx);
        if hash_indices
            .entry(hash_value[window_size - 1])
            .or_default()
            .len()
            == tokenized_file_names.len()
        {
            let slice = &tokens[0..window_size];
            common_tokens_in_order.clear();
            common_tokens_in_order.extend_from_slice(slice);
        }

        for i in window_size..tokens.len() {
            let token_val = token_id.get(&tokens[i]).expect("crash at hashing");

            let prev = if i > 0 { hash_value[i - 1] } else { 0 };
            hash_value[i] = (prev + p_pow[i] * token_val) % m;

            let mut normalized_hash_value = (hash_value[i] - hash_value[i - window_size] + m) % m;
            normalized_hash_value = (normalized_hash_value * p_pow_inv[i - window_size]) % m;

            hash_indices
                .entry(normalized_hash_value)
                .or_default()
                .insert(idx);

            if hash_indices.entry(normalized_hash_value).or_default().len()
                == tokenized_file_names.len()
            {
                let slice = &tokens[i - window_size + 1..=i];
                common_tokens_in_order.clear();
                common_tokens_in_order.extend_from_slice(slice);
            }
        }
    }
}
pub fn rolling_hash_algorithm(
    tokenized_file_names: &Vec<Vec<String>>,
    token_id: &HashMap<String, i64>,
    window_size: usize,
) -> HashMap<i64, HashSet<usize>> {
    let mut hash_indices: HashMap<i64, HashSet<usize>> = HashMap::new();
    let mut common_tokens: Vec<String> = Vec::new();
    get_hash_indices(
        tokenized_file_names,
        &mut hash_indices,
        token_id,
        window_size,
        &mut common_tokens,
    );
    hash_indices
}

pub fn get_common_token_order_using_rolling_hash(tokenized_sample: &Vec<Vec<String>>) -> String {
    let token_id = generate_token_id(tokenized_sample);
    let mut hash_indices: HashMap<i64, HashSet<usize>> = HashMap::new();
    let mut common_tokens_in_order: Vec<String> = Vec::new();
    for window_size in 1..10 {
        get_hash_indices(
            tokenized_sample,
            &mut hash_indices,
            &token_id,
            window_size,
            &mut common_tokens_in_order,
        );
    }
    return common_tokens_in_order.join(" ");
}

pub fn get_coupling_vec_using_rolling_hash(
    coupling: &mut Vec<Vec<f32>>,
    parsed_files: &Vec<Vec<String>>,
    token_id: &HashMap<String, i64>,
    max_window_size: usize,
) {
    for window_size in 1..max_window_size as usize {
        let hash_indices = rolling_hash_algorithm(parsed_files, token_id, window_size);
        for idx in hash_indices.values() {
            for i in idx {
                for j in idx {
                    if i >= j {
                        continue;
                    }
                    let idx_i = i.clone();
                    let idx_j = j.clone();
                    let a = parsed_files[idx_i].len();
                    let b = parsed_files[idx_j].len();
                    let to_add: f32 = (window_size as f32 * 2.0) / (a + b) as f32;
                    coupling[idx_i][idx_j] += to_add;
                }
            }
        }
    }
}
