use serde::{Deserialize, Serialize};
use std::process::Command;

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
    GitInfo {
        git_branch: get_git_branch(path),
        git_status: get_git_status(path),
        git_is_dirty: get_git_is_dirty(path),

        git_ahead: get_git_ahead(path),
        git_behind: get_git_behind(path),

        git_modified_count: get_git_modified_count(path),
        git_staged_count: get_git_staged_count(path),
        git_untracked_count: get_git_untracked_count(path),
        git_conflicted_count: get_git_conflicted_count(path),

        git_remote_url: get_git_remote_url(path),
        git_repo_name: get_git_repo_name(path),
        git_repo_path: get_git_repo_path(path),

        git_head_commit: get_git_head_commit(path),
        git_head_message: get_git_head_message(path),
        git_last_commit_date: get_git_last_commit_date(path),
    }
}

fn git(path: &String, args: &[&str]) -> Option<String> {
    let output = Command::new("git")
        .args(args)
        .current_dir(path)
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let output = String::from_utf8(output.stdout).ok()?;
    let output = output.trim();

    if output.is_empty() {
        None
    } else {
        Some(output.to_string())
    }
}

fn get_git_branch(path: &String) -> Option<String> {
    git(path, &["branch", "--show-current"])
}

fn get_git_status(path: &String) -> Option<String> {
    let status = Command::new("git")
        .args(["status", "--porcelain", "--branch"])
        .current_dir(path)
        .output()
        .ok()?;

    if !status.status.success() {
        return Some("none".to_string());
    }

    let output = String::from_utf8(status.stdout).ok()?;

    let mut ahead = false;
    let mut behind = false;
    let mut modified = false;
    let mut conflict = false;

    for line in output.lines() {
        if line.starts_with("##") {
            ahead = line.contains("ahead");
            behind = line.contains("behind");
            continue;
        }

        if line.starts_with("UU")
            || line.starts_with("AA")
            || line.starts_with("DD")
            || line.starts_with("AU")
            || line.starts_with("UA")
            || line.starts_with("DU")
            || line.starts_with("UD")
        {
            conflict = true;
        } else {
            modified = true;
        }
    }

    let status = if conflict {
        "conflict"
    } else if ahead && behind {
        "diverged"
    } else if ahead {
        "ahead"
    } else if behind {
        "behind"
    } else if modified {
        "modified"
    } else {
        "clean"
    };

    Some(status.to_string())
}

fn get_git_is_dirty(path: &String) -> Option<bool> {
    Some(get_git_status(path).is_some())
}

fn get_git_ahead(path: &String) -> Option<u32> {
    let counts = git(
        path,
        &["rev-list", "--left-right", "--count", "@{upstream}...HEAD"],
    )?;

    let mut split = counts.split_whitespace();
    split.next()?.parse().ok()
}

fn get_git_behind(path: &String) -> Option<u32> {
    let counts = git(
        path,
        &["rev-list", "--left-right", "--count", "@{upstream}...HEAD"],
    )?;

    let mut split = counts.split_whitespace();
    split.next()?;
    split.next()?.parse().ok()
}

fn get_git_modified_count(path: &String) -> Option<u32> {
    let status = git(path, &["status", "--porcelain"])?;
    Some(
        status
            .lines()
            .filter(|l| {
                let c = l.chars().next().unwrap_or(' ');
                c == 'M'
            })
            .count() as u32,
    )
}

fn get_git_staged_count(path: &String) -> Option<u32> {
    let status = git(path, &["status", "--porcelain"])?;
    Some(
        status
            .lines()
            .filter(|l| {
                let c = l.chars().next().unwrap_or(' ');
                c != ' ' && c != '?'
            })
            .count() as u32,
    )
}

fn get_git_untracked_count(path: &String) -> Option<u32> {
    let status = git(path, &["status", "--porcelain"])?;
    Some(status.lines().filter(|l| l.starts_with("??")).count() as u32)
}

fn get_git_conflicted_count(path: &String) -> Option<u32> {
    let status = git(path, &["status", "--porcelain"])?;
    Some(
        status
            .lines()
            .filter(|l| {
                let s = l.as_bytes();
                s.len() >= 2
                    && ((s[0] == b'U')
                        || (s[1] == b'U')
                        || (s[0] == b'A' && s[1] == b'A')
                        || (s[0] == b'D' && s[1] == b'D'))
            })
            .count() as u32,
    )
}

fn get_git_remote_url(path: &String) -> Option<String> {
    git(path, &["remote", "get-url", "origin"])
}

fn get_git_repo_name(path: &String) -> Option<String> {
    let remote = get_git_remote_url(path)?;

    remote
        .split('/')
        .last()
        .map(|s| s.trim_end_matches(".git").to_string())
}

fn get_git_repo_path(path: &String) -> Option<String> {
    git(path, &["rev-parse", "--show-toplevel"])
}

fn get_git_head_commit(path: &String) -> Option<String> {
    git(path, &["rev-parse", "HEAD"])
}

fn get_git_head_message(path: &String) -> Option<String> {
    git(path, &["log", "-1", "--pretty=%s"])
}

fn get_git_last_commit_date(path: &String) -> Option<String> {
    git(path, &["log", "-1", "--date=iso", "--pretty=%cd"])
}
