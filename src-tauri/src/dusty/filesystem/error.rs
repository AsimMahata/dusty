use crate::dusty::error::DustyError;

pub type FsError = DustyError;
pub type FsResult<T> = std::result::Result<T, FsError>;
