use std::sync::atomic::Ordering;
use crate::dusty::models::state::AppState;
use crate::dusty::logger::logger;

#[tauri::command]
pub fn page_changed(state: tauri::State<'_, AppState>) {
    let new_epoch = state.view_epoch.fetch_add(1, Ordering::Relaxed) + 1;
    logger::info!("PAGE_CHANGED", &format!("View epoch incremented to {}", new_epoch));
}
