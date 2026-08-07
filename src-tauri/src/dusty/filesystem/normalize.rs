use std::path::PathBuf;

pub fn to_string(path: &PathBuf) -> String {
    path.to_str()
        .map(|s| s.to_string())
        .unwrap_or_else(|| "ERROR_PATH".to_string())
}

pub fn file_name(path: &PathBuf) -> Option<String> {
    path.file_name()
        .and_then(|f| f.to_str())
        .map(|f| f.to_string())
}

pub fn file_stem(path: &PathBuf) -> Option<String> {
    path.file_stem()
        .and_then(|f| f.to_str())
        .map(|f| f.to_string())
}

pub fn extension(path: &PathBuf) -> Option<String> {
    path.extension()
        .and_then(|f| f.to_str())
        .map(|f| f.to_string())
}

pub fn starts_with_dot(path: &PathBuf) -> bool {
    path.file_name()
        .and_then(|n| n.to_str())
        .map_or(false, |s| s.starts_with('.'))
}
