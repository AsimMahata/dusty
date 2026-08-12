use crate::dusty::multithreading::BackgroundWorker;
use crate::dusty::multithreading::DbWorker;
use crate::dusty::multithreading::P2PWorker;
use crate::dusty::multithreading::ThreadPool;
use std::sync::atomic::AtomicU64;
use std::sync::Arc;

pub struct AppState {
    pub db_worker: DbWorker,
    pub tables: Vec<String>,
    pub os: String,
    pub thread_pool: ThreadPool,
    pub view_epoch: Arc<AtomicU64>,
    pub p2p_worker: P2PWorker,
    pub background_worker: BackgroundWorker,
}
