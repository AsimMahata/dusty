use rusqlite::{params, Connection};

use crate::dusty::{data::project::{Project, ProjectInfo}, logger::logger};

pub fn get_project_info_from_db(db: &Connection, id: &String) -> Result<ProjectInfo, String> {
     db.query_row(
        "SELECT project_type, pinned, status FROM projects WHERE id = ?1",
        params![id],
        |row| 
            Ok(ProjectInfo {
                project_type: row.get(0)?,
                pinned: row.get(1)?,
                status: row.get(2)?,
            })
    )
    .map_err(|err| {
        logger::error!("GET_SHOW_INFO_FAILED", err);
        err.to_string()
    })
}

pub fn add_projects_in_db(db: &Connection, projects: &Vec<Project>) -> Result<(), String> {
    for project in projects {
        add_project_in_db(db, &project)
            .map_err(|err| logger::error!("INSERT_PROJECT_IN_DB_FAILED", err))
            .ok();
    }

    Ok(())  
}

fn add_in_projects_table(db: &Connection, project: &Project) -> rusqlite::Result<()> {
    db.execute(
        "
        INSERT INTO projects (id, title, path, project_type, pinned, status)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        ",
        params![project.id, &project.title, &project.path, &project.project_type, &project.pinned, &project.status]
    )?;

    Ok(())
}


pub fn add_project_in_db(db: &Connection, project: &Project) -> Result<(), String> {

    add_in_projects_table(db, project).map_err(|err| {
        logger::error!("INSERT_PROJECT_IN_DB_FAILED", err);
        err.to_string()
    })?;

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
            status TEXT NOT NULL DEFAULT 'default'
        )
        ",
        []
    )
    .map_err(|err| {
        logger::error!("CREATE_PROJECTS_TABLE_FAILED", err);
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

pub fn update_project_pin_status_in_db(db: &Connection, id: &String, pinned: bool) -> Result<(), String> {
    db.execute(
        "UPDATE projects SET pinned = ?1 WHERE id = ?2",
        params![pinned, id]
    )
    .map_err(|err| {
        logger::error!("UPDATE_PROJECT_PIN_STATUS_IN_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn update_project_status_in_db(db: &Connection, id: &String, status: &String) -> Result<(), String> {
    db.execute(
        "UPDATE projects SET status = ?1 WHERE id = ?2",
        params![status, id]
    )
    .map_err(|err| {
        logger::error!("UPDATE_PROJECT_STATUS_IN_DB_FAILED", err);
        err.to_string()
    })?;

    Ok(())
}

pub fn reset_project_table_in_db(db: &Connection) -> Result<(), String> {
    db.execute(
        "DROP TABLE IF EXISTS projects",
        []
    )
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
