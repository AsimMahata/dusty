use crate::dusty::{
    data::user::User,
    error::{DustyError, Result},
    logger::logger,
};
use rusqlite::{params, Connection};
use uuid::Uuid;
use chrono::Utc;
use sysinfo::System;
use std::env;

pub fn create_user_table(conn: &Connection) -> Result<()> {
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
    .map_err(|err| DustyError::db("create_user_table", Some("user".to_string()), err))?;
    Ok(())
}

pub fn create_default_user(conn: &Connection) -> Result<User> {
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
    .map_err(|err| DustyError::db("create_default_user", Some("user".to_string()), err))?;

    Ok(user)
}

pub fn get_user_in_db(conn: &Connection) -> Result<User> {
    let mut stmt = conn
        .prepare("SELECT id, display_name, avatar, hostname, device_name, created_at, updated_at FROM user LIMIT 1")
        .map_err(|err| DustyError::db("prepare_get_user", Some("user".to_string()), err))?;

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
        Err(err) => Err(DustyError::db("get_user", Some("user".to_string()), err)),
    }
}

pub fn save_user_in_db(conn: &Connection, user: &User) -> Result<()> {
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
    .map_err(|err| DustyError::db("save_user", Some("user".to_string()), err))?;
    Ok(())
}

pub fn update_display_name_in_db(conn: &Connection, display_name: String) -> Result<User> {
    let now = Utc::now().timestamp();
    conn.execute(
        "UPDATE user SET display_name = ?1, updated_at = ?2",
        params![display_name, now],
    )
    .map_err(|err| DustyError::db("update_display_name", Some("user".to_string()), err))?;
    get_user_in_db(conn)
}

pub fn update_avatar_in_db(conn: &Connection, avatar: Option<String>) -> Result<User> {
    let now = Utc::now().timestamp();
    conn.execute(
        "UPDATE user SET avatar = ?1, updated_at = ?2",
        params![avatar, now],
    )
    .map_err(|err| DustyError::db("update_avatar", Some("user".to_string()), err))?;
    get_user_in_db(conn)
}

pub fn reset_user_in_db(conn: &Connection) -> Result<User> {
    conn.execute("DELETE FROM user", [])
        .map_err(|err| DustyError::db("reset_user_delete", Some("user".to_string()), err))?;
    create_default_user(conn)
}
