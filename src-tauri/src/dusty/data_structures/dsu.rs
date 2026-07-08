use std::{
    collections::{HashMap, HashSet},
    mem::swap,
    result,
};

#[derive(Debug)]
pub struct Dsu {
    parent: Vec<i32>,
    size: Vec<i32>,
    cap: usize,
}

impl Dsu {
    pub fn new(n: usize) -> Self {
        Self {
            parent: vec![-1; n],
            size: vec![1; n],
            cap: n,
        }
    }
    pub fn init(&mut self) {
        for i in 0..self.cap {
            self.make_set(i as i32);
        }
    }
    pub fn find_set(&mut self, v: i32) -> i32 {
        let par = self.parent[v as usize];
        if par == v {
            return v;
        }
        let root = self.find_set(par);
        self.parent[v as usize] = root;
        root
    }
    pub fn make_set(&mut self, v: i32) {
        self.parent[v as usize] = v;
    }
    pub fn union_set(&mut self, u: i32, v: i32) {
        let mut a = self.find_set(u);
        let mut b = self.find_set(v);
        if a != b {
            if self.size[a as usize] > self.size[b as usize] {
                swap(&mut a, &mut b);
            }
            self.parent[b as usize] = a;
            self.size[a as usize] = self.size[a as usize] + self.size[b as usize];
        }
    }
    pub fn get_index_clusters(&self) -> Vec<Vec<i32>> {
        let mut result: Vec<Vec<i32>> = Vec::new();
        let mut hs: HashMap<i32, Vec<i32>> = HashMap::new();
        for i in 0..self.cap {
            hs.entry(self.parent[i]).or_default().push(i as i32);
        }
        for value in hs.values() {
            result.push(value.clone());
        }
        result
    }
}
