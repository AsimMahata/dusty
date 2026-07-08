use crate::dusty::data_structures::dsu::Dsu;

pub fn levenshtein_distance(s: &str, t: &str) -> i32 {
    let n = s.len();
    let m = t.len();

    let s = s.as_bytes();
    let t = t.as_bytes();

    let mut dp = vec![vec![0; m + 1]; n + 1];

    for i in 0..=n {
        dp[i][0] = i as i32;
    }

    for j in 0..=m {
        dp[0][j] = j as i32;
    }

    for i in 1..=n {
        for j in 1..=m {
            let cost = (s[i - 1] != t[j - 1]) as i32;

            dp[i][j] = (dp[i - 1][j] + 1)
                .min(dp[i][j - 1] + 1)
                .min(dp[i - 1][j - 1] + cost);
        }
    }

    dp[n][m]
}

pub fn edit_dist_string_clusters(batch: Vec<String>) -> Vec<Vec<i32>> {
    let mut all_dist: Vec<(i32, i32, i32)> = Vec::new();
    let n = batch.len();
    for i in 0..n {
        for j in i + 1..n {
            let file1 = batch.get(i).expect("This should not crash");
            let file2 = batch.get(j).expect("This should not crash");
            let dist = levenshtein_distance(file1, file2);
            all_dist.push((dist, i as i32, j as i32));
        }
    }
    let threshold = 10;

    let mut dsu: Dsu = Dsu::new(n);
    dsu.init();

    for (d, i, j) in all_dist.clone() {
        if d < threshold {
            dsu.union_set(i, j);
        }
    }
    return dsu.get_index_clusters();
}
