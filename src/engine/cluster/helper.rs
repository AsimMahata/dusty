use std::collections::HashMap;

use crate::datastructures::dsu::Dsu;

pub fn generate_token_id(tokenized_file_names: &Vec<Vec<String>>) -> HashMap<String, i64> {
    let mut token_id: HashMap<String, i64> = HashMap::new();
    let mut count = 33;

    for tokens in tokenized_file_names {
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
