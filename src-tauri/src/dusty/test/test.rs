use std::sync::Mutex;

use rusqlite::Connection;
use sha256::digest;

#[tauri::command]
pub fn test(state: tauri::State<Mutex<Connection>>) {
    // pulls it up one level
}

fn test_string_to_sha256(input: String) -> String {
    return digest(input);
}
