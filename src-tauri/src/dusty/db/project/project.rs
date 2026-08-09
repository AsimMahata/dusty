use rusqlite::{params, Connection};

use crate::dusty::{
    models::project::{Framework, Project, ProjectInfo, Tag},
    error::{DustyError, Result},
};

pub fn get_project_info_from_db(db: &Connection, id: &String) -> Result<ProjectInfo> {
    db.query_row(
        "SELECT project_type, pinned, status, tags FROM projects WHERE id = ?1",
        params![id],
        |row| {
            let tags_json: String = row.get(3)?;
            let tags = serde_json::from_str::<Vec<String>>(&tags_json)
                .unwrap_or_default()
                .iter()
                .filter_map(|tag| Tag::from_string(tag))
                .collect();
            let project_type: String = row.get(0)?;
            Ok(ProjectInfo {
                project_type: Some(Framework::from_value(&project_type)),
                pinned: row.get(1)?,
                status: row.get(2)?,
                tags,
            })
        },
    )
    .map_err(|err| DustyError::db("get_project_info", Some("projects".to_string()), err))
}

pub fn add_projects_in_db(db: &Connection, projects: &Vec<Project>) -> Result<()> {
    for project in projects {
        add_project_in_db(db, &project)?;
    }
    Ok(())
}

fn add_in_projects_table(db: &Connection, project: &Project) -> Result<()> {
    let tags_json = serde_json::to_string(&project.tags)
        .map_err(|e| DustyError::serde("serialize_project_tags", e))?;
    db.execute(
        "
        INSERT OR IGNORE INTO projects (id, title, path, project_type, pinned, status, tags)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
        ",
        params![
            project.id,
            &project.title,
            &project.path,
            project.project_type.clone().unwrap_or_default().to_string(),
            &project.pinned,
            &project.status,
            tags_json
        ],
    )
    .map_err(|err| DustyError::db("add_in_projects_table", Some("projects".to_string()), err))?;

    Ok(())
}

fn add_in_project_cache_table(db: &Connection, project: &Project) -> Result<()> {
    let data = serde_json::to_string(project)
        .map_err(|e| DustyError::serde("serialize_project_cache", e))?;
    db.execute(
        "
        INSERT OR REPLACE INTO project_cache (id,data)
        VALUES (?1, ?2)
        ",
        params![project.id, data],
    )
    .map_err(|err| DustyError::db("add_in_project_cache_table", Some("project_cache".to_string()), err))?;

    Ok(())
}

pub fn clear_project_cache(db: &Connection) -> Result<()> {
    db.execute("DELETE FROM project_cache", [])
        .map_err(|err| DustyError::db("clear_project_cache", Some("project_cache".to_string()), err))?;
    Ok(())
}

pub fn get_project_cache_from_db(db: &Connection) -> Result<Vec<Project>> {
    let mut stmt = db
        .prepare("SELECT data FROM project_cache")
        .map_err(|err| DustyError::db("prepare_get_project_cache", Some("project_cache".to_string()), err))?;

    let iter = stmt
        .query_map([], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|err| DustyError::db("query_get_project_cache", Some("project_cache".to_string()), err))?;

    let mut projects = Vec::new();
    for row in iter {
        if let Ok(data) = row {
            if let Ok(project) = serde_json::from_str::<Project>(&data) {
                projects.push(project);
            }
        }
    }

    Ok(projects)
}

pub fn add_project_in_db(db: &Connection, project: &Project) -> Result<()> {
    add_in_projects_table(db, project)?;
    add_in_project_cache_table(db, project)?;
    Ok(())
}

pub fn create_projects_table(db: &Connection) -> Result<()> {
    db.execute(
        "
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            project_type TEXT NOT NULL DEFAULT 'Unknown',
            pinned BOOLEAN NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'default',
            tags TEXT NOT NULL DEFAULT '[]',
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
        ",
        [],
    )
    .map_err(|err| DustyError::db("create_projects_table", Some("projects".to_string()), err))?;

    db.execute(
        "
        CREATE TABLE IF NOT EXISTS project_cache (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
            updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
        )
        ",
        [],
    )
    .map_err(|err| DustyError::db("create_project_cache_table", Some("project_cache".to_string()), err))?;

    use crate::dusty::db::core::init::ensure_column_exists;
    ensure_column_exists(db, "projects", "tags", "TEXT NOT NULL DEFAULT '[]'")?;
    ensure_column_exists(db, "projects", "created_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;
    ensure_column_exists(db, "projects", "updated_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;
    ensure_column_exists(db, "project_cache", "created_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;
    ensure_column_exists(db, "project_cache", "updated_at", "TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))")?;

    Ok(())
}

pub fn print_all_projects_in_db(db: &Connection) -> Result<()> {
    let mut stmt = db
        .prepare("SELECT id, title, path, project_type, pinned, status FROM projects")
        .map_err(|err| DustyError::db("prepare_print_projects", Some("projects".to_string()), err))?;

    let rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, bool>(4)?,
                row.get::<_, String>(5)?,
            ))
        })
        .map_err(|err| DustyError::db("query_print_projects", Some("projects".to_string()), err))?;

    println!("=== Projects ===");

    for row in rows {
        let (id, title, path, project_type, pinned, status) = row
            .map_err(|err| DustyError::db("read_print_projects_row", Some("projects".to_string()), err))?;

        println!("ID        : {}", id);
        println!("Title     : {}", title);
        println!("Path      : {}", path);
        println!("Type      : {}", project_type);
        println!("Pinned    : {}", pinned);
        println!("Status    : {}", status);
        println!("-------------------------");
    }

    Ok(())
}

pub fn update_project_pin_status_in_db(
    db: &Connection,
    id: &String,
    pinned: bool,
) -> Result<()> {
    db.execute(
        "UPDATE projects SET pinned = ?1 WHERE id = ?2",
        params![pinned, id],
    )
    .map_err(|err| DustyError::db("update_project_pin_status", Some("projects".to_string()), err))?;
    Ok(())
}

pub fn update_project_status_in_db(
    db: &Connection,
    id: &String,
    status: &String,
) -> Result<()> {
    db.execute(
        "UPDATE projects SET status = ?1 WHERE id = ?2",
        params![status, id],
    )
    .map_err(|err| DustyError::db("update_project_status", Some("projects".to_string()), err))?;

    Ok(())
}

pub fn update_project_tags_in_db(
    db: &Connection,
    id: &String,
    tags: &Vec<Tag>,
) -> Result<()> {
    let tags_json = serde_json::to_string(tags)
        .map_err(|e| DustyError::serde("serialize_project_tags", e))?;
    db.execute(
        "UPDATE projects SET tags = ?1 WHERE id = ?2",
        params![tags_json, id],
    )
    .map_err(|err| DustyError::db("update_project_tags", Some("projects".to_string()), err))?;

    Ok(())
}

pub fn reset_project_table_in_db(db: &Connection) -> Result<()> {
    db.execute("DROP TABLE IF EXISTS projects", [])
        .map_err(|err| DustyError::db("reset_projects_table_drop", Some("projects".to_string()), err))?;
    db.execute("DROP TABLE IF EXISTS project_cache", [])
        .map_err(|err| DustyError::db("reset_project_cache_drop", Some("project_cache".to_string()), err))?;

    create_projects_table(db)
}
