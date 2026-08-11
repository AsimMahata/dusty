use crate::dusty::multithreading::{DbWorker, P2PWorker, ThreadPool};
use std::sync::{atomic::AtomicU64, Arc};

pub struct AppState {
    pub db_worker: DbWorker,
    pub tables: Vec<String>,
    pub os: String,
    pub thread_pool: ThreadPool,
    pub view_epoch: Arc<AtomicU64>,
    pub p2p_worker: P2PWorker,
}

