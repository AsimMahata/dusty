use std::path::PathBuf;

use crate::dusty::{
    models::file::FileInfo,
    filesystem::read::list_raw,
};

pub fn scan_dir(dir: &PathBuf) -> Vec<FileInfo> {
    match list_raw(dir) {
        Ok(paths) => paths
            .into_iter()
            .filter_map(|p| match FileInfo::from_pathbuf(&p) {
                Ok(info) => Some(info),
                Err(e) => {
                    eprintln!("Failed to process {}: {}", p.display(), e);
                    None
                }
            })
            .collect(),
        Err(_) => Vec::new(),
    }
}
