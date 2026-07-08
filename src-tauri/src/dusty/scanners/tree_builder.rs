use std::path::PathBuf;

use crate::dusty::{scanners::dfs::dfs_tree_build, types::tree::Tree};

pub fn build_file_tree(path: PathBuf) -> Tree {
    let mut tree = Tree::new(path);
    dfs_tree_build(&mut tree.root);
    return tree;
}
