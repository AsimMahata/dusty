#![allow(unused_imports)]
use std::collections::HashSet;
use std::path::PathBuf;
use std::{fs, path};

use mime_guess::Mime;
use mime_guess::mime::{self, AUDIO, IMAGE, Name, VIDEO};

use crate::handlers::{audio, default, image, video};
use crate::types::file_types::Files;
use crate::types::tree::{Node, Tree};

pub fn read_all_files(files: &mut Files, path: &PathBuf) {
    println!("this is the path: {:#?}", path);
    let entries = fs::read_dir(&path).expect(&format!("failed to read directory {:?}", path));

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

fn dfs(node: &mut Node) {
    // pass
    let entries = fs::read_dir(node.get_name())
        .expect(&format!("filed to read directory {:?}", node.get_name()));
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
    println!("this is the path: {:#?}", path);
    // Actual work
    let mut tree = Tree::new(path);
    dfs(&mut tree.root);
    return tree;
}
