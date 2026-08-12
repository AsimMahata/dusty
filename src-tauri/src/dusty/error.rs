use std::fmt;
use std::io;
use std::path::PathBuf;

#[derive(Debug)]
pub enum DustyError {
    Io {
        path: Option<PathBuf>,
        op: &'static str,
        source: io::Error,
    },
    Db {
        op: String,
        table: Option<String>,
        source: rusqlite::Error,
    },
    Serde {
        op: String,
        source: serde_json::Error,
    },
    LockFailed {
        op: String,
    },
    InvalidPath {
        path: PathBuf,
        reason: String,
    },
    Custom(String),
}

impl DustyError {
    pub fn io(op: &'static str, path: impl Into<PathBuf>, source: io::Error) -> Self {
        DustyError::Io {
            path: Some(path.into()),
            op,
            source,
        }
    }

    pub fn io_op(op: &'static str, source: io::Error) -> Self {
        DustyError::Io {
            path: None,
            op,
            source,
        }
    }

    pub fn db(op: impl Into<String>, table: Option<String>, source: rusqlite::Error) -> Self {
        DustyError::Db {
            op: op.into(),
            table,
            source,
        }
    }

    pub fn serde(op: impl Into<String>, source: serde_json::Error) -> Self {
        DustyError::Serde {
            op: op.into(),
            source,
        }
    }

    pub fn lock(op: impl Into<String>) -> Self {
        DustyError::LockFailed { op: op.into() }
    }

    pub fn invalid_path(path: impl Into<PathBuf>, reason: impl Into<String>) -> Self {
        DustyError::InvalidPath {
            path: path.into(),
            reason: reason.into(),
        }
    }

    pub fn log_details(&self) -> String {
        match self {
            DustyError::Io { path, op, source } => {
                format!(
                    "operation={} path={} error=\"{}\" source={:?}",
                    op,
                    path.as_ref()
                        .map(|p| p.display().to_string())
                        .unwrap_or_else(|| "none".to_string()),
                    source,
                    source
                )
            }
            DustyError::Db { op, table, source } => {
                format!(
                    "operation={} table={} error=\"{}\" source={:?}",
                    op,
                    table.as_deref().unwrap_or("none"),
                    source,
                    source
                )
            }
            DustyError::Serde { op, source } => {
                format!("operation={} error=\"{}\" source={:?}", op, source, source)
            }
            DustyError::LockFailed { op } => {
                format!("operation={} error=\"mutex_lock_failed\"", op)
            }
            DustyError::InvalidPath { path, reason } => {
                format!(
                    "operation=path_validation path={} reason=\"{}\"",
                    path.display(),
                    reason
                )
            }
            DustyError::Custom(msg) => format!("error=\"{}\"", msg),
        }
    }

    pub fn to_user_message(&self) -> String {
        format!("{}", self)
    }
}

impl std::error::Error for DustyError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            DustyError::Io { source, .. } => Some(source),
            DustyError::Db { source, .. } => Some(source),
            DustyError::Serde { source, .. } => Some(source),
            _ => None,
        }
    }
}

impl fmt::Display for DustyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DustyError::Io { path, op, source } => {
                if let Some(p) = path {
                    write!(f, "Failed to {} '{}': {}", op, p.display(), source)
                } else {
                    write!(f, "Failed to {}: {}", op, source)
                }
            }
            DustyError::Db { op, table, source } => {
                if let Some(t) = table {
                    write!(
                        f,
                        "Database operation '{}' failed on table '{}': {}",
                        op, t, source
                    )
                } else {
                    write!(f, "Database operation '{}' failed: {}", op, source)
                }
            }
            DustyError::Serde { op, source } => {
                write!(
                    f,
                    "Serialization/deserialization failed during '{}': {}",
                    op, source
                )
            }
            DustyError::LockFailed { op } => {
                write!(f, "Failed to acquire database lock during '{}'", op)
            }
            DustyError::InvalidPath { path, reason } => {
                write!(f, "Invalid path '{}': {}", path.display(), reason)
            }
            DustyError::Custom(msg) => write!(f, "{}", msg),
        }
    }
}

impl From<io::Error> for DustyError {
    fn from(err: io::Error) -> Self {
        DustyError::Io {
            path: None,
            op: "filesystem operation",
            source: err,
        }
    }
}

impl From<rusqlite::Error> for DustyError {
    fn from(err: rusqlite::Error) -> Self {
        DustyError::Db {
            op: "database operation".to_string(),
            table: None,
            source: err,
        }
    }
}

impl From<serde_json::Error> for DustyError {
    fn from(err: serde_json::Error) -> Self {
        DustyError::Serde {
            op: "serde operation".to_string(),
            source: err,
        }
    }
}

pub type Result<T> = std::result::Result<T, DustyError>;
