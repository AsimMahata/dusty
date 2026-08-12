use crate::dusty::error::DustyError;
use crate::dusty::error::Result;
use crate::dusty::models::file::FileInfo;
use crate::dusty::models::shows::ShowResult;
use rusqlite::Connection;

pub fn create_recent_ep_table(db: &Connection) -> Result<()> {
    let sql = "CREATE TABLE IF NOT EXISTS recent_episodes (
        id TEXT NOT NULL PRIMARY KEY,
        data TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )";
    db.execute(sql, []).map_err(|err| {
        DustyError::db(
            "create_recent_ep_table",
            Some("recent_episodes".to_string()),
            err,
        )
    })?;
    Ok(())
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct VideoItem {
    pub show: ShowResult,
    pub episode: FileInfo,
}

pub fn add_recent_episode_in_db(db: &Connection, video: VideoItem) -> Result<()> {
    let data = serde_json::to_string(&video)
        .map_err(|e| DustyError::serde("serialize_recent_episode", e))?;
    let id = video.episode.id.clone();
    let sql = "INSERT OR REPLACE INTO recent_episodes (id, data) VALUES (?, ?)";
    db.execute(sql, [id, data]).map_err(|err| {
        DustyError::db(
            "add_recent_episode",
            Some("recent_episodes".to_string()),
            err,
        )
    })?;
    Ok(())
}

pub fn get_recent_episodes_from_db(db: &Connection) -> Result<Vec<VideoItem>> {
    let sql = "SELECT id, data FROM recent_episodes ORDER BY timestamp DESC LIMIT 10";
    let mut stmt = db.prepare(sql).map_err(|err| {
        DustyError::db(
            "prepare_get_recent_episodes",
            Some("recent_episodes".to_string()),
            err,
        )
    })?;

    let videos_iter = stmt
        .query_map([], |row| {
            let data: String = row.get(1)?;
            let video_item: std::result::Result<VideoItem, _> = serde_json::from_str(&data);
            Ok(video_item)
        })
        .map_err(|err| {
            DustyError::db(
                "query_get_recent_episodes",
                Some("recent_episodes".to_string()),
                err,
            )
        })?;

    let mut videos = Vec::new();
    for video in videos_iter {
        if let Ok(Ok(v)) = video {
            videos.push(v);
        }
    }
    Ok(videos)
}

pub fn reset_recent_episodes_table_in_db(db: &Connection) -> Result<()> {
    let sql = "DROP TABLE IF EXISTS recent_episodes";
    db.execute(sql, []).map_err(|err| {
        DustyError::db(
            "reset_recent_episodes_drop",
            Some("recent_episodes".to_string()),
            err,
        )
    })?;
    create_recent_ep_table(db)
}
