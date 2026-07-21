use serde::{Deserialize, Serialize};
use git2::{Repository, StatusOptions};
use chrono::{FixedOffset, TimeZone};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GitInfo {
    pub git_branch: Option<String>,
    pub git_status: Option<String>,
    pub git_is_dirty: Option<bool>,

    pub git_ahead: Option<u32>,
    pub git_behind: Option<u32>,

    pub git_modified_count: Option<u32>,
    pub git_staged_count: Option<u32>,
    pub git_untracked_count: Option<u32>,
    pub git_conflicted_count: Option<u32>,

    pub git_remote_url: Option<String>,
    pub git_repo_name: Option<String>,
    pub git_repo_path: Option<String>,

    pub git_head_commit: Option<String>,
    pub git_head_message: Option<String>,
    pub git_last_commit_date: Option<String>,
}

pub fn get_git_info_sys(path: &String) -> GitInfo {
    let mut info = GitInfo::default();

    let repo = match Repository::discover(path) {
        Ok(repo) => repo,
        Err(_) => {
            info.git_status = Some("none".to_string());
            info.git_is_dirty = Some(false);
            return info;
        }
    };

    if let Some(workdir) = repo.workdir() {
        info.git_repo_path = Some(workdir.to_string_lossy().to_string());
    }

    if let Ok(head) = repo.head() {
        if head.is_branch() {
            if let Ok(name) = head.shorthand() {
                info.git_branch = Some(name.to_string());
            }
        }
        
        if let Ok(commit) = head.peel_to_commit() {
            info.git_head_commit = Some(commit.id().to_string());
            info.git_head_message = commit.message().ok().map(|m| m.trim().to_string());
            
            let time = commit.time();
            if let Some(offset) = FixedOffset::east_opt(time.offset_minutes() * 60) {
                if let Some(dt) = offset.timestamp_opt(time.seconds(), 0).single() {
                    info.git_last_commit_date = Some(dt.format("%Y-%m-%d %H:%M:%S %z").to_string());
                }
            }
        }
    }

    let mut modified = 0;
    let mut staged = 0;
    let mut untracked = 0;
    let mut conflicted = 0;

    let mut opts = StatusOptions::new();
    opts.include_untracked(true).recurse_untracked_dirs(true);

    if let Ok(statuses) = repo.statuses(Some(&mut opts)) {
        for entry in statuses.iter() {
            let status = entry.status();
            if status.contains(git2::Status::CONFLICTED) {
                conflicted += 1;
            } else {
                if status.intersects(git2::Status::WT_MODIFIED | git2::Status::WT_DELETED | git2::Status::WT_TYPECHANGE | git2::Status::WT_RENAMED) {
                    modified += 1;
                }
                if status.intersects(git2::Status::INDEX_NEW | git2::Status::INDEX_MODIFIED | git2::Status::INDEX_DELETED | git2::Status::INDEX_RENAMED | git2::Status::INDEX_TYPECHANGE) {
                    staged += 1;
                }
                if status.contains(git2::Status::WT_NEW) {
                    untracked += 1;
                }
            }
        }
    }

    info.git_modified_count = Some(modified);
    info.git_staged_count = Some(staged);
    info.git_untracked_count = Some(untracked);
    info.git_conflicted_count = Some(conflicted);

    let mut ahead = 0;
    let mut behind = 0;
    
    if let Ok(head) = repo.head() {
        if head.is_branch() {
            let branch = git2::Branch::wrap(head);
            if let Ok(upstream) = branch.upstream() {
                if let (Some(local_oid), Some(upstream_oid)) = (branch.get().target(), upstream.get().target()) {
                    if let Ok((a, b)) = repo.graph_ahead_behind(local_oid, upstream_oid) {
                        ahead = a as u32;
                        behind = b as u32;
                    }
                }
            }
        }
    }
    
    info.git_ahead = Some(ahead);
    info.git_behind = Some(behind);

    let status_str = if conflicted > 0 {
        "conflict"
    } else if ahead > 0 && behind > 0 {
        "diverged"
    } else if ahead > 0 {
        "ahead"
    } else if behind > 0 {
        "behind"
    } else if modified > 0 || staged > 0 || untracked > 0 {
        "modified"
    } else {
        "clean"
    };

    info.git_status = Some(status_str.to_string());
    info.git_is_dirty = Some(status_str != "clean");

    if let Ok(remote) = repo.find_remote("origin") {
        if let Ok(url) = remote.url() {
            info.git_remote_url = Some(url.to_string());
            let parts: Vec<&str> = url.split('/').collect();
            if let Some(last) = parts.last() {
                info.git_repo_name = Some(last.trim_end_matches(".git").to_string());
            }
        }
    }

    info
}
