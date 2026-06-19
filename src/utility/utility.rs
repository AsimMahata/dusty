use std::path::PathBuf;

pub fn strip_folder_name(file: &PathBuf) -> Option<String> {
    file.file_stem()
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
