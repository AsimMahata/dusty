use crate::{
    data::shows::{Show, Shows},
    engine::{
        algo::rolling_hash::get_common_token_order_using_rolling_hash,
        utility::parser::{get_tokenized_file_names, get_tokenized_file_names_for_title_making},
    },
    utility::utility::{strip_folder_name, strip_folder_name_in_batch},
};
use rand::rng;
use rand::seq::SliceRandom;
use std::{cmp::min, path::PathBuf};

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
pub fn make_shows_from_clusters(clusters: &Vec<Vec<PathBuf>>, shows: &mut Shows) {
    for cluster in clusters {
        if cluster.len() < 2 {
            continue;
        }
        let title = generate_show_title(cluster);
        let season: Option<i32> = None;
        let num_of_ep: usize = cluster.len();
        let show = Show::new(title, season, num_of_ep, cluster.clone());
        shows.insert_new_show(show);
    }
}
pub fn generate_show_title(cluster: &Vec<PathBuf>) -> String {
    // what is the logic

    /* "C:\\Users\\asim\\Downloads\\Telegram Desktop\\To Your Eternity S3 - 16 [Hdrip] [Sub].mkv",
       "C:\\Users\\asim\\Downloads\\Telegram Desktop\\To.Your.Eternity.S03E17.Invisible.Battle.1080p.AMZN.WEB-DL.English.DDP2.0-Japanese.DDP2.0.H.264-4kHdHub.Com.mkv",
       "C:\\Users\\asim\\Downloads\\Telegram Desktop\\To.Your.Eternity.S03E18.A.Willingness.to.Believe.1080p.AMZN.WEB-DL.English.DDP2.0-Japanese.DDP2.0.H.264-4kHdHub.Com.mkv",
    */
    /*
     *1. Randomly Select 2-3 files
     *2. use some algo to find the common part
     *3. longest Match
     *
     *
     * */
    let random_sample: Vec<PathBuf> = extract_random_sample(cluster);
    let title: String = find_common_part(&random_sample);
    return title;
    // if let Some(first_video) = cluster.first() {
    //     if let Some(title) = strip_folder_name(first_video) {
    //         return title;
    //     }
    // }
    // return "UNKNOWN".to_string();
}
// TODO: Try to replace Noisy word with random string it will help only retreive the name of the
// or find a better way to categorize noisy word
// A simple SOLUTION is to ask user the original title thus deleting those noisy word
fn find_common_part(random_sample: &Vec<PathBuf>) -> String {
    let tokenized_sample = get_tokenized_file_names_for_title_making(random_sample);
    let common_part: String = get_common_token_order_using_rolling_hash(&tokenized_sample);
    return common_part;
}

fn extract_random_sample(cluster: &Vec<PathBuf>) -> Vec<PathBuf> {
    let n = cluster.len();
    let mut idx: Vec<usize> = (0..n).collect();
    idx.shuffle(&mut rng());
    let mut sample: Vec<PathBuf> = Vec::new();
    for i in 0..min(n, 3) {
        sample.push(cluster[idx[i]].clone());
    }
    sample
}
