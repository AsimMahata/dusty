use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::dusty::data::file::FileInfo;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
#[serde(rename_all = "snake_case")]
pub enum ShowType {
    Anime,
    TvShow,
    Movie,
    #[default]
    Unknown,
}

impl ShowType {
    pub fn as_str(&self) -> &str {
        match self {
            ShowType::Anime => "anime",
            ShowType::TvShow => "tv_show",
            ShowType::Movie => "movie",
            ShowType::Unknown => "unknown",
        }
    }
    pub fn from_str(s: &str) -> Self {
        match s {
            "anime" => ShowType::Anime,
            "tv_show" => ShowType::TvShow,
            "movie" => ShowType::Movie,
            _ => ShowType::Unknown,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ShowResult {
    pub id: String,
    pub title: String,
    pub gen_title: String,
    pub num_episodes: Option<usize>,
    pub episodes: Vec<FileInfo>,
    pub dir: Option<String>,
    #[serde(default)]
    pub banned: bool,
    #[serde(default)]
    pub pinned: bool,
    pub season: Option<i32>,
    pub status: String,
    pub show_id: Option<String>,
    #[serde(default)]
    pub airing: bool,
    #[serde(default)]
    pub show_type: ShowType,
}

pub struct ShowInfo {
    pub title: String,
    pub status: String,
    pub banned: bool,
    pub pinned: bool,
    pub show_id: Option<String>,
    pub airing: bool,
    pub show_type: ShowType,
}

#[derive(Serialize, Debug)]
pub struct Show {
    title: String,
    season: Option<i32>,
    num_of_ep: usize,
    list_of_ep: Vec<PathBuf>,
    dir: PathBuf,
}

impl Show {
    pub fn new(
        title: String,
        season: Option<i32>,
        num_of_ep: usize,
        list_of_ep: Vec<PathBuf>,
        dir: PathBuf,
    ) -> Self {
        Self {
            title: title,
            season: season,
            num_of_ep: num_of_ep,
            list_of_ep: list_of_ep,
            dir,
        }
    }
    pub fn default() -> Self {
        Self {
            title: String::new(),
            season: None,
            num_of_ep: 0,
            list_of_ep: Vec::new(),
            dir: PathBuf::new(),
        }
    }
    pub fn get_title(&self) -> String {
        return self.title.clone();
    }
    pub fn get_season(&self) -> Option<i32> {
        return self.season;
    }
    pub fn get_number_of_ep(&self) -> usize {
        return self.num_of_ep;
    }
    pub fn get_dir(&self) -> PathBuf {
        return self.dir.clone();
    }
    pub fn get_eps(&self) -> &Vec<PathBuf> {
        return &self.list_of_ep;
    }
}

#[derive(Debug)]
pub struct Shows {
    list_of_shows: Vec<Show>,
}
impl Shows {
    pub fn new() -> Self {
        Self {
            list_of_shows: Vec::new(),
        }
    }
    pub fn insert_new_show(&mut self, show: Show) {
        self.list_of_shows.push(show);
    }
    pub fn get_list_of_shows(&self) -> &Vec<Show> {
        return &self.list_of_shows;
    }
}
