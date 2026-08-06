use std::path::PathBuf;

use crate::dusty::{logger::logger, system::terminal::{available_terminals, open_terminal_at}};


#[tauri::command]
pub fn get_available_terminals() ->Vec<String>{
    available_terminals()
}

#[tauri::command]
pub fn open_terminal_at_path(path:String,terminal:String)->Result<(),String>{
    let path_buf = PathBuf::from(path);
    open_terminal_at(&path_buf, &terminal).map_err(|err|{
        logger::error!("FAILED_OPEN_TERMINAL_AT",err.to_string());
        err.to_string()
    })?;
    Ok(())
}