use std::path::PathBuf;

pub fn strip_folder_name(batch: &Vec<PathBuf>) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    for file in batch {
        if let Some(os_name) = file.file_stem() {
            if let Some(name) = os_name.to_str() {
                result.push(name.to_string());
            }
        }
    }
    return result;
}
