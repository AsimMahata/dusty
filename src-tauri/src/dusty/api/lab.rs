use crate::dusty::engine::utility::parser::tokenize_string;

#[tauri::command]
pub fn tokenize(input: String) -> Vec<String> {
    tokenize_string(&input)
}
