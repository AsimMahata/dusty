use rusqlite::{params, Connection};

use crate::dusty::{
    data::project::{Framework, Project, ProjectInfo, Tag},
    logger::logger,
};

pub fn get_project_info_from_db(db: &Connection, id: &String) -> Result<ProjectInfo, String> {
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
    .map_err(|err| {
        logger::error!("GET_SHOW_INFO_FAILED", err);
        err.to_string()
    })
}

pub fn add_projects_in_db(db: &Connection, projects: &Vec<Project>) -> Result<(), String> {
    for project in projects {
        add_project_in_db(db, &project).ok();
    }

    Ok(())
}

fn add_in_projects_table(db: &Connection, project: &Project) -> rusqlite::Result<()> {
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
            serde_json::to_string(&project.tags).unwrap_or_else(|_| "[]".to_string())
        ],
    )?;

    Ok(())
}

fn add_in_project_cache_table(db: &Connection, project: &Project) -> rusqlite::Result<()> {
    let data = serde_json::to_string(project).unwrap_or_default();
    db.execute(
        "
        INSERT OR REPLACE INTO project_cache (id,data)
        VALUES (?1, ?2)
        ",
        params![project.id, data],
    )?;

    Ok(())
}

pub fn clear_project_cache(db: &Connection) -> Result<(), String> {
    db.execute("DELETE FROM project_cache", [])
        .map_err(|err| {
            logger::error!("CLEAR_PROJECT_CACHE_FAILED", err);
            err.to_string()
        })?;
    Ok(())
}

pub fn get_project_cache_from_db(db: &Connection) -> Result<Vec<Project>, String> {
    let mut stmt = db
        .prepare("SELECT data FROM project_cache")
        .map_err(|e| e.to_string())?;

    let iter = stmt
        .query_map([], |row| {
            let data: String = row.get(0)?;
            Ok(data)
        })
        .map_err(|e| e.to_string())?;

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

pub fn add_project_in_db(db: &Connection, project: &Project) -> Result<(), String> {
    add_in_projects_table(db, project).map_err(|err| err.to_string())?;
    add_in_project_cache_table(db, project).map_err(|err| err.to_string())?;
    Ok(())
}

pub fn create_projects_table(db: &Connection) -> Result<(), String> {
    db.execute(
        "
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            path TEXT NOT NULL,
            project_type TEXT NOT NULL DEFAULT 'Unknown',
            pinned BOOLEAN NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'default',
            tags TEXT NOT NULL DEFAULT '[]'
        )
        ",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_PROJECTS_TABLE_FAILED", err);
        err.to_string()
    })?;

    let mut columns = db.prepare("PRAGMA table_info(projects)").map_err(|err| err.to_string())?;
    let has_tags_column = columns
        .query_map([], |row| row.get::<_, String>(1))
        .map_err(|err| err.to_string())?
        .filter_map(Result::ok)
        .any(|column| column == "tags");

    if !has_tags_column {
        db.execute("ALTER TABLE projects ADD COLUMN tags TEXT NOT NULL DEFAULT '[]'", [])
            .map_err(|err| err.to_string())?;
    }

    db.execute(
        "
        CREATE TABLE IF NOT EXISTS project_cache (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL
        )
        ",
        [],
    )
    .map_err(|err| {
        logger::error!("CREATE_PROJECT_CACHE_TABLE_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn print_all_projects_in_db(db: &Connection) -> Result<(), String> {
    let mut stmt = db
        .prepare("SELECT id, title, path, project_type, pinned, status FROM projects")
        .map_err(|err| {
            logger::error!("PREPARE_PRINT_PROJECTS_FAILED", err);
            err.to_string()
        })?;

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
        .map_err(|err| {
            logger::error!("QUERY_PRINT_PROJECTS_FAILED", err);
            err.to_string()
        })?;

    println!("=== Projects ===");

    for row in rows {
        let (id, title, path, project_type, pinned, status) = row.map_err(|err| {
            logger::error!("READ_PRINT_PROJECTS_FAILED", err);
            err.to_string()
        })?;

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
) -> Result<(), String> {
    db.execute(
        "UPDATE projects SET pinned = ?1 WHERE id = ?2",
        params![pinned, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_PROJECT_PIN_STATUS_IN_DB_FAILED", err);
        err.to_string()
    })?;
    logger::info!("UPDATE_PROJECT_PIN_STATUS_SUCCESS",
        [format!("id: {}", id), format!("pinned: {}", pinned)]
    );
    Ok(())
}

pub fn update_project_status_in_db(
    db: &Connection,
    id: &String,
    status: &String,
) -> Result<(), String> {
    db.execute(
        "UPDATE projects SET status = ?1 WHERE id = ?2",
        params![status, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_PROJECT_STATUS_IN_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn update_project_tags_in_db(
    db: &Connection,
    id: &String,
    tags: &Vec<Tag>,
) -> Result<(), String> {
    let tags_json = serde_json::to_string(tags).map_err(|err| err.to_string())?;
    db.execute(
        "UPDATE projects SET tags = ?1 WHERE id = ?2",
        params![tags_json, id],
    )
    .map_err(|err| {
        logger::error!("UPDATE_PROJECT_TAGS_IN_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn reset_project_table_in_db(db: &Connection) -> Result<(), String> {
    db.execute("DROP TABLE IF EXISTS projects", [])
        .map_err(|err| {
            logger::error!("RESET_PROJECT_TABLE_IN_DB_FAILED", err);
            err.to_string()
        })?;
    db.execute("DROP TABLE IF EXISTS project_cache", [])
        .map_err(|err| {
            logger::error!("RESET_PROJECT_TABLE_IN_DB_FAILED", err);
            err.to_string()
        })?;

    create_projects_table(db).map_err(|err| {
        logger::error!("CREATE_PROJECTS_TABLE_IN_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}
