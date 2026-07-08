use std::path::{self, PathBuf};

use crate::dusty::data::file::FileInfo;

#[derive(Debug, Clone)]
pub struct ImageDir {
    path: PathBuf,
    size: u64,
    childs: Vec<ImageDir>,
    images: Vec<FileInfo>,
}

impl ImageDir {
    pub fn new(path: PathBuf) -> Self {
        Self {
            path: path,
            size: 0,
            childs: Vec::new(),
            images: Vec::new(),
        }
    }
    pub fn get_size(&self) -> u64 {
        self.size
    }
    pub fn get_path(&self) -> PathBuf {
        self.path.clone()
    }
    pub fn add_child(&mut self, child: &ImageDir) {
        self.childs.push(child.clone());
        self.size += child.get_size();
    }
    pub fn add_childs(&mut self, childs: &Vec<ImageDir>) {
        for child in childs {
            self.add_child(child);
        }
    }
    pub fn add_image(&mut self, image: &FileInfo) {
        self.images.push(image.clone());
        self.size += image.get_size();
    }
    pub fn add_images(&mut self, images: &Vec<FileInfo>) {
        for image in images {
            self.add_image(image);
        }
    }
}
