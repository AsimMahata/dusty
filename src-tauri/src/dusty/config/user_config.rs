use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

pub fn get_config_file_path(app_handle: &tauri::AppHandle) -> Result<PathBuf> {
    let home_dir = app_handle.path().home_dir().map_err(|e| {
        DustyError::io_op(
            "get_home_dir",
            std::io::Error::new(std::io::ErrorKind::Other, e.to_string()),
        )
    })?;
    let user_dir = home_dir.join(".dusty").join("user");
    Ok(user_dir.join("config.json"))
}

pub fn read_config_json(config_path: &PathBuf) -> Result<Value> {
    if !config_path.exists() {
        return Ok(serde_json::json!({}));
    }

    let content = fs::read_to_string(config_path)
        .map_err(|e| DustyError::io("read_config_file", config_path, e))?;

    if content.trim().is_empty() {
        return Ok(serde_json::json!({}));
    }

    let json: Value = serde_json::from_str(&content)
        .map_err(|e| DustyError::serde("deserialize_user_config", e))?;

    Ok(json)
}

pub fn write_config_json(config_path: &PathBuf, json: &Value) -> Result<()> {
    if let Some(parent) = config_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| DustyError::io("create_config_directory", parent, e))?;
    }

    let formatted = serde_json::to_string_pretty(json)
        .map_err(|e| DustyError::serde("serialize_user_config", e))?;

    fs::write(config_path, formatted)
        .map_err(|e| DustyError::io("write_config_file", config_path, e))?;

    Ok(())
}

fn resolve_key_path(id: &str) -> (&'static str, &str) {
    if id == "active_show_page_tab" {
        ("show_page", "active_tab")
    } else if let Some(rest) = id.strip_prefix("show_page_") {
        (
            "show_page",
            match rest {
                "sort_method" => "sort_method",
                "sort_ascending" => "sort_ascending",
                "is_grid_layout" => "is_grid_layout",
                _ => rest,
            },
        )
    } else if let Some(rest) = id.strip_prefix("todo_page_") {
        ("todo_page", rest)
    } else if let Some(rest) = id.strip_prefix("projects_page_") {
        ("projects_page", rest)
    } else if let Some(rest) = id.strip_prefix("zip_page_") {
        ("zip_page", rest)
    } else if let Some(rest) = id.strip_prefix("pdf_page_") {
        ("pdf_page", rest)
    } else if let Some(rest) = id.strip_prefix("misc_page_") {
        ("misc_page", rest)
    } else if let Some(rest) = id.strip_prefix("media_sources_page_") {
        (
            "media_page",
            match rest {
                "sort_method" => "sources_sort_method",
                "sort_ascending" => "sources_sort_ascending",
                _ => rest,
            },
        )
    } else if let Some(rest) = id.strip_prefix("media_list_page_") {
        (
            "media_page",
            match rest {
                "sort_mode" => "list_sort_mode",
                _ => rest,
            },
        )
    } else if id == "default_terminal" {
        ("terminal", "default")
    } else {
        ("", "")
    }
}

pub fn get_config_value_from_file(
    app_handle: &tauri::AppHandle,
    id: String,
) -> Result<Option<String>> {
    let config_path = get_config_file_path(app_handle)?;
    let root = read_config_json(&config_path)?;

    if let Some(val) = root.get(&id) {
        let string_val =
            serde_json::to_string(val).map_err(|e| DustyError::serde("serialize_config_val", e))?;
        return Ok(Some(string_val));
    }

    let (section, prop) = resolve_key_path(&id);
    if !section.is_empty() && !prop.is_empty() {
        if let Some(sec_val) = root.get(section) {
            if let Some(val) = sec_val.get(prop) {
                let string_val = serde_json::to_string(val)
                    .map_err(|e| DustyError::serde("serialize_config_val", e))?;
                return Ok(Some(string_val));
            }
        }
    }

    if let Some((sec, prop)) = id.split_once('.') {
        if let Some(sec_val) = root.get(sec) {
            if let Some(val) = sec_val.get(prop) {
                let string_val = serde_json::to_string(val)
                    .map_err(|e| DustyError::serde("serialize_config_val", e))?;
                return Ok(Some(string_val));
            }
        }
    }

    Ok(None)
}

pub fn set_config_value_in_file(
    app_handle: &tauri::AppHandle,
    id: String,
    raw_value: String,
) -> Result<()> {
    let config_path = get_config_file_path(app_handle)?;
    let mut root = read_config_json(&config_path)?;

    let val_to_insert: Value =
        serde_json::from_str(&raw_value).unwrap_or_else(|_| Value::String(raw_value));

    let (section, prop) = resolve_key_path(&id);
    if !section.is_empty() && !prop.is_empty() {
        if !root.is_object() {
            root = serde_json::json!({});
        }
        if root.get(section).is_none() || !root[section].is_object() {
            root[section] = serde_json::json!({});
        }
        root[section][prop] = val_to_insert;
    } else if let Some((sec, prop)) = id.split_once('.') {
        if !root.is_object() {
            root = serde_json::json!({});
        }
        if root.get(sec).is_none() || !root[sec].is_object() {
            root[sec] = serde_json::json!({});
        }
        root[sec][prop] = val_to_insert;
    } else {
        if !root.is_object() {
            root = serde_json::json!({});
        }
        root[&id] = val_to_insert;
    }

    write_config_json(&config_path, &root)
}

pub fn reset_config_file(app_handle: &tauri::AppHandle) -> Result<()> {
    let config_path = get_config_file_path(app_handle)?;
    if config_path.exists() {
        let _ = fs::remove_file(&config_path);
    }
    write_config_json(&config_path, &serde_json::json!({}))
}
