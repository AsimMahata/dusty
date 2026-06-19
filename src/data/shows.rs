use std::path::PathBuf;

#[derive(Debug)]
pub struct Show {
    title: String,
    season: Option<i32>,
    num_of_ep: i32,
    start_ep: Option<i32>,
    end_ep: Option<i32>,
    list_of_ep: Vec<PathBuf>,
}
impl Show {
    pub fn new(
        title: String,
        season: Option<i32>,
        num_of_ep: i32,
        start_ep: Option<i32>,
        end_ep: Option<i32>,
        list_of_ep: Vec<PathBuf>,
    ) -> Self {
        Self {
            title: title,
            season: season,
            num_of_ep: num_of_ep,
            start_ep: start_ep,
            end_ep: end_ep,
            list_of_ep: list_of_ep,
        }
    }
    pub fn default() -> Self {
        Self {
            title: String::new(),
            season: None,
            num_of_ep: 0,
            start_ep: None,
            end_ep: None,
            list_of_ep: Vec::new(),
        }
    }
    pub fn get_title(&self) -> String {
        return self.title.clone();
    }
    pub fn get_season(&self) -> Option<i32> {
        return self.season;
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
