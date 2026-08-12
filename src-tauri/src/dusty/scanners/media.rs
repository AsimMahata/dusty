use mime_guess::mime::Name;

use std::path::PathBuf;

use crate::dusty::filesystem::scan::list_children;
use crate::dusty::filesystem::scan::ScanOptions;
use crate::dusty::models::file::FileInfo;
use crate::dusty::models::media::MediaDir;
use crate::dusty::utility::info::get_file_type;

pub fn dfs_media_dir_scanner(
    path: &PathBuf,
    media_dirs: &mut Vec<MediaDir>,
    is_root: bool,
    media_type_name: Name<'static>,
) -> Vec<MediaDir> {
    let mut has_media = false;
    let mut valid_child: Vec<MediaDir> = Vec::new();

    let opts = ScanOptions {
        is_root,
        ..ScanOptions::default()
    };
    let children = list_children(path, &opts);
    if children.blocked {
        return valid_child;
    }

    let mut media: Vec<FileInfo> = Vec::new();
    for file in &children.files {
        if is_media(file, &media_type_name) {
            if let Ok(info) = FileInfo::from_pathbuf(file) {
                media.push(info);
                has_media = true;
            }
        }
    }

    for child in children.dirs {
        valid_child.extend(dfs_media_dir_scanner(
            &child,
            media_dirs,
            false,
            media_type_name.clone(),
        ));
    }

    if has_media || valid_child.len() > 2 {
        let mut dir = MediaDir::new(path.clone(), Some(media_type_name.as_str().to_string()));
        for child_dir in &valid_child {
            dir.childs.push(child_dir.clone());
        }
        dir.media.extend(media);
        media_dirs.push(dir.clone());
    }
    valid_child
}

fn is_media(path: &PathBuf, media_type_name: &Name<'static>) -> bool {
    get_file_type(path).map_or(false, |g| g.eq(media_type_name))
}
