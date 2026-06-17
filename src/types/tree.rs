use std::{collections::HashSet, path::PathBuf, process::Child};

use mime_guess::mime::Name;

#[derive(Debug)]
pub struct Node {
    name: PathBuf,
    types: HashSet<Name<'static>>,
    healty: bool,
    childs: Vec<Node>,
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("Dropping node: {:?}", self.name);
    }
}

impl Node {
    pub fn new(path: PathBuf) -> Self {
        Self {
            name: path,
            childs: Vec::new(),
            types: HashSet::new(),
            healty: true,
        }
    }
    pub fn get_name(&self) -> &PathBuf {
        return &self.name;
    }
    pub fn insert_child(&mut self, node: Node) {
        self.childs.push(node);
    }
    // pub fn get_childs(&self) -> &Vec<Node> {
    //     &self.childs
    // }
    pub fn get_childs_mut(&mut self) -> &mut Vec<Node> {
        &mut self.childs
    }
    pub fn insert_type(&mut self, t: Name<'static>) {
        self.types.insert(t);
    }
    pub fn get_types(&self) -> &HashSet<Name<'static>> {
        return &self.types;
    }
    pub fn get_child_count(&self) -> usize {
        return self.childs.len();
    }
    pub fn short_circuit_children(&mut self) {
        // pass
        if self.get_child_count() == 1 {
            let child = self.childs.remove(0);
            *self = child;
        }
    }

    pub fn disable_node(&mut self) {
        self.healty = false;
    }
    #[allow(dead_code)]
    pub fn check_health(&self) -> bool {
        return self.healty;
    }

    pub fn check_disability(&mut self) {
        if self.types.len() == 0 {
            self.disable_node();
        }
    }
}

#[derive(Debug)]

pub struct Tree {
    pub root: Node,
}

impl Tree {
    pub fn new(path: PathBuf) -> Self {
        Self {
            root: Node::new(path),
        }
    }
    pub fn print(&self) {
        println!("Tree :: \n {:#?}", self);
    }
}
