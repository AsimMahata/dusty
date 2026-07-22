use crate::dusty::engine::shows::coupling::get_coupling_value_between_anime_title_and_file_name;

#[tauri::command]
pub fn get_coupling_value_between_query_and_result_title(s1: String, s2: String) -> f32 {
    get_coupling_value_between_anime_title_and_file_name(s1, s2)
}
