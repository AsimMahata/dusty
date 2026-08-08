use crate::dusty::{
    data::{
        file::FileInfo,
        shows::{Show, ShowResult, ShowType},
    },
    utility::sha256_hash::get_sha256_id,
};

pub fn show_to_show_result(s: &Show) -> ShowResult {
    ShowResult {
        id: get_sha256_id(s.get_dir().to_string_lossy().into_owned(), s.get_title()),
        title: s.get_title(),
        get_title: s.get_title(),
        num_episodes: Some(s.get_number_of_ep()),
        episodes: s
            .get_eps()
            .iter()
            .filter_map(|p| FileInfo::from_pathbuf(p).ok())
            .collect(),
        dir: Some(s.get_dir().to_string_lossy().into_owned()),
        banned: false,
        pinned: false,
        season: s.get_season(),
        status: "default".to_string(),
        provider: None,
        provider_id: None,
        airing: false,
        show_type: ShowType::Unknown,
        created_at: None,
        updated_at: None,
    }
}
