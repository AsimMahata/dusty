use crate::dusty::{
    data::{
        file::FileInfo,
        shows::{Show, ShowResult, Shows},
    },
    db::anime::Anime,
    engine::{
        algo::rolling_hash::get_common_token_order_using_rolling_hash,
        cluster::cluster::cluster_files,
        shows::coupling::get_coupling_value_between_anime_title_and_file_name,
        utility::parser::get_tokenized_file_names_for_title_making,
    },
    utility::sha256_hash::get_sha256_id,
};
use rand::rng;
use rand::seq::SliceRandom;
use std::{
    cmp::{max, min},
    path::PathBuf,
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
pub fn make_shows_from_clusters(clusters: &Vec<Vec<PathBuf>>, shows: &mut Shows, dir: &PathBuf) {
    for cluster in clusters {
        if cluster.len() < 2 {
            continue;
        }
        let title = generate_show_title(cluster);
        if title.len() == 0 {
            continue;
        };
        let season: Option<i32> = None;
        let num_of_ep: usize = cluster.len();
        let show = Show::new(title, season, num_of_ep, cluster.clone(), dir.clone());
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
    let mut sample: Vec<PathBuf> = Vec::new();
    for i in 0..min(n, 3) {
        sample.push(cluster[i].clone());
    }
    sample
}

pub fn make_show_results_from_clusters(clusters: &Vec<Vec<PathBuf>>, shows: &mut Vec<ShowResult>) {
    for cluster in clusters {
        if cluster.len() < 2 {
            continue;
        }
        let title = generate_show_title(cluster);
        if title.len() == 0 {
            continue;
        };
        let season: Option<i32> = None;
        let num_of_ep: usize = cluster.len();
        let show = ShowResult {
            id: get_sha256_id("SHOW".to_string(), title.clone()),
            gen_title: title.clone(),
            title: title.clone(),
            season: season,
            num_episodes: Some(num_of_ep),
            dir: Some(cluster[0].to_str().unwrap().to_string()),
            banned: false,
            pinned: false,
            status: "default".to_string(),
            mal_id: None,
            airing: false,
            episodes: cluster
                .clone()
                .into_iter()
                .map(|p| FileInfo::from_pathbuf(&p).expect("Crashed on main inside dusty"))
                .collect(),
        };
        shows.push(show);
    }
}

// pub struct ShowResult {
//     pub id: String,
//     pub title: String,
//     pub gen_title: String,
//     pub num_episodes: usize,
//     pub episodes: Vec<FileInfo>,
//     pub dir: Option<String>,
//     pub banned: bool,
//     pub pinned: bool,
//     pub season: Option<i32>,
//     pub status: String,
//     pub mal_id: Option<i32>,
//     pub seasonal:bool,
// }

pub fn make_shows_with_available_anime_titles(
    videos: &Vec<PathBuf>,
    anime_list: &Vec<Anime>,
) -> Vec<ShowResult> {
    let mut shows: Vec<ShowResult> = Vec::new();
    let mut vis: Vec<bool> = vec![false; videos.len()];
    for anime in anime_list {
        let id = get_sha256_id("SHOW".to_string(), anime.title.clone());
        let title = &anime.title;
        let gen_title = title.clone();
        let num_episodes = anime.num_episodes;
        let mut episodes: Vec<FileInfo> = Vec::new();
        let banned = false;
        let pinned = false;
        let mal_id = Some(anime.mal_id);
        let season = anime.season;
        let airing = anime.airing;
        let status = "default".to_string();
        let dir = Some(String::new());

        for (i, video) in videos.iter().enumerate() {
            if vis[i] {
                continue;
            }
            let file_name = video.file_name().unwrap().to_str().unwrap().to_string();
            let match_value = check_for_match(title.to_string(), file_name);
            if match_value > 0.5 {
                let file_info =
                    FileInfo::from_pathbuf(&video).expect("Crashed on main inside dusty");
                episodes.push(file_info);
                vis[i] = true;
            };
        }
        if episodes.len() > 0 {
            shows.push(ShowResult {
                id,
                title: title.to_string(),
                gen_title: gen_title.to_string(),
                num_episodes,
                episodes,
                dir: dir.clone(),
                banned,
                pinned,
                season,
                status,
                mal_id,
                airing,
            });
        }
    }
    let mut leftovers: Vec<PathBuf> = Vec::new();
    for (i, video) in videos.iter().enumerate() {
        if !vis[i] {
            leftovers.push(video.clone());
        }
    }
    let clusters = cluster_files(&leftovers);
    make_show_results_from_clusters(&clusters, &mut shows);
    shows
}

pub fn check_for_match(anime_title: String, file_name: String) -> f32 {
    get_coupling_value_between_anime_title_and_file_name(anime_title, file_name)
}
