use crate::dusty::data::project::{Project, Tag};

pub fn get_readme_if_available(path: String) -> Option<String> {
    let readme_path = format!("{}/README.md", path);
    let readme = std::fs::read_to_string(readme_path);
    match readme {
        Ok(readme) => Some(readme),
        Err(_) => None,
    }
}
pub fn tokenize_readme(readme: String) -> Vec<String> {
    let delims: &[char] = &[' ', ',', '.', ';', ':', '\n', '\r', '\t'];

    readme
        .split(delims)
        .filter(|token| !token.is_empty())
        .map(|token| token.trim().to_string())
        .collect()
}
pub fn parse_tags_from_readme(readme: String) -> Vec<Tag> {
    let tokens = tokenize_readme(readme);
    let tags: Vec<Tag> = tokens
        .iter()
        .filter_map(|t| match Tag::from_string(t) {
            Some(tag) => Some(tag),
            None => None,
        })
        .collect();
    tags
}
pub fn scan_tags_from_readme(project: &Project) -> Vec<Tag> {
    let path = project.path.clone();
    let readme = get_readme_if_available(path);
    match readme {
        Some(readme) => parse_tags_from_readme(readme),
        _ => Vec::new(),
    }
}
