use crate::dusty::{
    data::user::User,
    logger::logger,
};
use rusqlite::{params, Connection};
use uuid::Uuid;
use chrono::Utc;
use sysinfo::System;
use std::env;

pub fn create_user_table(conn: &Connection) -> Result<(), String> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            display_name TEXT NOT NULL,
            avatar TEXT,
            hostname TEXT NOT NULL,
            device_name TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        )",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_USER_TABLE_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn create_default_user(conn: &Connection) -> Result<User, String> {
    let id = Uuid::new_v4().to_string();
    let display_name = env::var("USERNAME")
        .or_else(|_| env::var("USER"))
        .unwrap_or_else(|_| "Dusty User".to_string());
    
    let hostname = System::host_name().unwrap_or_else(|| "Unknown".to_string());
    let device_name = System::host_name().unwrap_or_else(|| "Unknown Device".to_string());
    let now = Utc::now().timestamp();

    let user = User {
        id,
        display_name,
        avatar: None,
        hostname,
        device_name,
        created_at: now,
        updated_at: now,
    };

    conn.execute(
        "INSERT INTO user (id, display_name, avatar, hostname, device_name, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            &user.id,
            &user.display_name,
            &user.avatar,
            &user.hostname,
            &user.device_name,
            user.created_at,
            user.updated_at
        ],
    )
    .map_err(|err| {
        logger::error!("CREATE_DEFAULT_USER_FAILED", err);
        err.to_string()
    })?;

    Ok(user)
}

pub fn get_user_in_db(conn: &Connection) -> Result<User, String> {
    let mut stmt = conn
        .prepare("SELECT id, display_name, avatar, hostname, device_name, created_at, updated_at FROM user LIMIT 1")
        .map_err(|err| err.to_string())?;

    let user_res = stmt.query_row([], |row| {
        Ok(User {
            id: row.get(0)?,
            display_name: row.get(1)?,
            avatar: row.get(2)?,
            hostname: row.get(3)?,
            device_name: row.get(4)?,
            created_at: row.get(5)?,
            updated_at: row.get(6)?,
        })
    });

    match user_res {
        Ok(user) => Ok(user),
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            logger::info!("No local user found. Creating a default user identity.", "");
            create_default_user(conn)
        }
        Err(err) => {
            logger::error!("GET_USER_FROM_DB_FAILED", err);
            Err(err.to_string())
        }
    }
}

pub fn save_user_in_db(conn: &Connection, user: &User) -> Result<(), String> {
    conn.execute(
        "INSERT OR REPLACE INTO user (id, display_name, avatar, hostname, device_name, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            &user.id,
            &user.display_name,
            &user.avatar,
            &user.hostname,
            &user.device_name,
            user.created_at,
            user.updated_at
        ],
    )
    .map_err(|err| {
        logger::error!("SAVE_USER_FAILED", err);
        err.to_string()
    })?;
    Ok(())
}

pub fn update_display_name_in_db(conn: &Connection, display_name: String) -> Result<User, String> {
    let now = Utc::now().timestamp();
    conn.execute(
        "UPDATE user SET display_name = ?1, updated_at = ?2",
        params![display_name, now],
    )
    .map_err(|err| {
        logger::error!("UPDATE_DISPLAY_NAME_FAILED", err);
        err.to_string()
    })?;
    get_user_in_db(conn)
}

pub fn update_avatar_in_db(conn: &Connection, avatar: Option<String>) -> Result<User, String> {
    let now = Utc::now().timestamp();
    conn.execute(
        "UPDATE user SET avatar = ?1, updated_at = ?2",
        params![avatar, now],
    )
    .map_err(|err| {
        logger::error!("UPDATE_AVATAR_FAILED", err);
        err.to_string()
    })?;
    get_user_in_db(conn)
}

pub fn reset_user_in_db(conn: &Connection) -> Result<User, String> {
    conn.execute("DELETE FROM user", []).map_err(|err| {
        logger::error!("DELETE_USER_ROWS_FAILED", err);
        err.to_string()
    })?;
    create_default_user(conn)
}
