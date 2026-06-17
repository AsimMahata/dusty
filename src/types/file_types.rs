use std::{collections::HashMap, path::PathBuf};

pub type Data = HashMap<String, Vec<PathBuf>>;

pub struct Files {
    pub videos: Data,
    pub audios: Data,
    pub images: Data,
    pub others: Data,
}

impl Files {
    pub fn new() -> Self {
        Self {
            videos: HashMap::new(),
            audios: HashMap::new(),
            images: HashMap::new(),
            others: HashMap::new(),
        }
    }
}
