#![allow(unused_imports)]
use std::collections::HashSet;
use std::fs::{DirEntry, ReadDir};
use std::path::PathBuf;
use std::{fs, path};

use mime_guess::Mime;
use mime_guess::mime::{self, AUDIO, IMAGE, Name, VIDEO};

use crate::handlers::{audio, default, image, video};
use crate::types::file_types::Files;
use crate::types::tree::{Node, Tree};

pub fn read_all_files(files: &mut Files, path: &PathBuf) {
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return;
        }
    };

    for entry in entries {
        let file_path = entry.expect("something wrong with this file").path();
        let guess = mime_guess::from_path(&file_path);

        match guess.first() {
            Some(m) => match m.type_() {
                mime::VIDEO => video::video_handler(files, file_path),
                mime::AUDIO => audio::audio_handler(files, file_path),
                mime::IMAGE => image::image_handler(files, file_path),
                _ => default::default_handler(files, file_path),
            },
            _ => {}
        }
    }
}

fn get_file_type(file_path: PathBuf) -> Option<Name<'static>> {
    let guess = mime_guess::from_path(&file_path);

    match guess.first() {
        Some(m) => match m.type_() {
            mime::VIDEO => Some(mime::VIDEO),
            mime::AUDIO => Some(mime::AUDIO),
            mime::IMAGE => Some(mime::IMAGE),
            _ => None,
        },
        None => None,
    }
}
pub fn list_all_videos(path: &PathBuf) -> Vec<PathBuf> {
    let mut videos: Vec<PathBuf> = Vec::new();
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", path, e);
            return Vec::new();
        }
    };

    for entry in entries {
        let file_path = entry.expect("something wrong with this file").path();
        let is_video = mime_guess::from_path(&file_path)
            .first()
            .map(|g| g.type_() == mime::VIDEO)
            .unwrap_or(false);
        if is_video {
            videos.push(file_path);
        }
    }
    videos
}

fn dfs(node: &mut Node) {
    // pass
    let entries = match fs::read_dir(node.get_name()) {
        Ok(entries) => entries,
        Err(e) => {
            println!("skipping {:?}: {}", node.get_name(), e);
            return;
        }
    };
    for entry in entries {
        let child = entry.expect("something wrong with this child");
        if child
            .metadata()
            .expect("failed to retrieve metadata")
            .is_dir()
        {
            node.insert_child(Node::new(child.path()));
        } else {
            //     println!("Found a File Called {:?}", child);
            if let Some(format) = get_file_type(child.path()) {
                node.insert_type(format);
            }
        }
    }

    let mut all_types: HashSet<Name<'static>> = HashSet::new();
    for child in node.get_childs_mut() {
        dfs(child);
        for t in child.get_types() {
            all_types.insert(t.clone());
        }
    }

    for t in all_types {
        node.insert_type(t);
    }
    // short circuit children
    node.short_circuit_children();
    // remove useless children
    node.check_disability();
}

pub fn build_file_tree(path: PathBuf) -> Tree {
    let mut tree = Tree::new(path);
    dfs(&mut tree.root);
    return tree;
}
