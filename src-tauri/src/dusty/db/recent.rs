use rusqlite::Connection;
use crate::dusty::{data::{file::FileInfo, shows::ShowResult}, logger::logger, utility::sha256_hash::get_sha256_id};

pub fn create_recent_ep_table(db:&Connection)->Result<(),String>{
    let sql = "CREATE TABLE IF NOT EXISTS recent_episodes (
        id TEXT NOT NULL PRIMARY KEY,
        data TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    db.execute(sql, []).map_err(|err|{
        logger::error!("CREATE_RECENT_EP_TABLE_FAILED",err);
        err.to_string()
    })?;
    Ok(())
}
#[derive(serde::Deserialize, serde::Serialize)]
pub struct VideoItem{
    pub show:ShowResult,
    pub episode:FileInfo
}

pub fn add_recent_episode_in_db(db:&Connection,video:VideoItem)->Result<(),String>{
    let data = serde_json::to_string(&video).unwrap();
    let id = video.episode.id.clone();
    let sql = "INSERT OR REPLACE INTO recent_episodes (id, data) VALUES (?, ?)";
    db.execute(sql, [id, data]).map_err(|err|{
        logger::error!("ADD_RECENT_EP_TABLE_FAILED",err);
        err.to_string()
    })?;
    Ok(())
}

pub fn get_recent_episodes_from_db(db:&Connection)->Result<Vec<VideoItem>,String>{
    let sql = "SELECT id, data FROM recent_episodes ORDER BY timestamp DESC LIMIT 10";
    let mut stmt = db.prepare(sql).map_err(|err|{
        logger::error!("GET_RECENT_EP_TABLE_FAILED", err);
        err.to_string()
    })?;
    
    let videos_iter = stmt.query_map([], |row| {
        let data: String = row.get(1)?;
        let video_item: VideoItem = serde_json::from_str(&data).unwrap();
        Ok(video_item)
    }).map_err(|err|{
        logger::error!("GET_RECENT_EP_TABLE_FAILED", err);
        err.to_string()
    })?;

    let mut videos = Vec::new();
    for video in videos_iter {
        if let Ok(v) = video {
            videos.push(v);
        }
    }
   Ok(videos)
}

pub fn reset_recent_episodes_table_in_db(db:&Connection)->Result<(),String>{
    let sql = "DROP TABLE IF EXISTS recent_episodes";
    db.execute(sql, []).map_err(|err|{
        logger::error!("RESET_RECENT_EP_TABLE_FAILED",err);
        err.to_string()
    })?;
    create_recent_ep_table(db)
}