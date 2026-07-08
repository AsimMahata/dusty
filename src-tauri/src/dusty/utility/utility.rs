use std::path::PathBuf;

pub fn strip_folder_name(file: &PathBuf) -> Option<String> {
    file.file_stem()
        .and_then(|f| f.to_str())
        .map(|f| f.to_string())
}

pub fn get_title(p: &PathBuf) -> String {
    if let Some(name) = get_file_name(p) {
        return name;
    }
    return "ERROR_GET_TITLE".to_string();
}
pub fn path_buf_to_string(p: &PathBuf) -> String {
    p.to_str()
        .map(|s| s.to_string())
        .unwrap_or("ERROR_PATHBUF_TO_STR".to_string())
}

pub fn get_file_name(file: &PathBuf) -> Option<String> {
    file.file_name()
        .and_then(|f| f.to_str())
        .map(|f| f.to_string())
}

pub fn strip_folder_name_in_batch(batch: &Vec<PathBuf>) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    for file in batch {
        if let Some(name) = strip_folder_name(file) {
            result.push(name);
        }
    }
    return result;
}

pub fn format_size(bytes: u64) -> String {
    let b = bytes as f64;

    const KB: f64 = 1024.0;
    const MB: f64 = KB * 1024.0;
    const GB: f64 = MB * 1024.0;
    const TB: f64 = GB * 1024.0;

    if b >= TB {
        format!("{:.2} TB", b / TB)
    } else if b >= GB {
        format!("{:.2} GB", b / GB)
    } else if b >= MB {
        format!("{:.2} MB", b / MB)
    } else if b >= KB {
        format!("{:.2} KB", b / KB)
    } else {
        format!("{} B", bytes)
    }
}
