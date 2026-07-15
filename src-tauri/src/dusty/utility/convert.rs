use crate::dusty::{
    data::{
        file::FileInfo,
        shows::{Show, ShowResult},
    },
    utility::sha256_hash::get_sha256_id,
};

pub fn show_to_show_result(s: &Show) -> ShowResult {
    ShowResult {
        id: get_sha256_id(s.get_dir().to_string_lossy().into_owned(), s.get_title()),
        title: s.get_title(),
        gen_title: s.get_title(),
        num_episodes: s.get_number_of_ep(),
        episodes: s
            .get_eps()
            .iter()
            .map(|p| FileInfo::from_pathbuf(p).expect("Crashed on main inside dusty"))
            .collect(),
        dir: s.get_dir().to_string_lossy().into_owned(),
        banned: false,
        pinned: false,
        season: s.get_season(),
        status: "default".to_string(),
    }
}
