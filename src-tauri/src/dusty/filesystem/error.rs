use std::io;

pub type FsResult<T> = Result<T, FsError>;

#[derive(Debug)]
pub enum FsError {
    Io(io::Error),
    InvalidPath(String),
}

impl From<io::Error> for FsError {
    fn from(e: io::Error) -> Self {
        FsError::Io(e)
    }
}
