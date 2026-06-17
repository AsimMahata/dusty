#[derive(Debug)]

pub struct DataBase {
    shows: Vec<String>,
}

impl DataBase {
    pub fn new() -> Self {
        Self { shows: Vec::new() }
    }
    pub fn insert_new_show(&mut self, show: String) {
        self.shows.push(show);
    }
    pub fn get_show_list(&self) -> &Vec<String> {
        return &self.shows;
    }
}
