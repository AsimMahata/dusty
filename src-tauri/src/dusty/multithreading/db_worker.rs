use crate::dusty::logger::logger;
use rusqlite::Connection;
use std::sync::atomic::AtomicU64;
use std::sync::atomic::Ordering;
use std::sync::mpsc;
use std::sync::Arc;
use std::thread;
use tokio::sync::oneshot;

type DbTask = Box<dyn FnOnce(&mut Connection) + Send + 'static>;

#[derive(Clone)]
pub struct DbWorker {
    sender: mpsc::Sender<DbTask>,
    view_epoch: Arc<AtomicU64>,
}

impl DbWorker {
    pub fn new(mut conn: Connection, view_epoch: Arc<AtomicU64>) -> Self {
        let (sender, receiver) = mpsc::channel::<DbTask>();

        thread::spawn(move || {
            logger::info!("DB_WORKER_STARTED", "Dedicated DB worker thread started");
            while let Ok(task) = receiver.recv() {
                task(&mut conn);
            }
            logger::info!("DB_WORKER_STOPPED", "Dedicated DB worker thread stopped");
        });

        Self { sender, view_epoch }
    }

    /// Asynchronously runs a DB operation on the dedicated DB thread. Checks if the task is stale before executing unless marked urgent.
    pub async fn run<F, R>(&self, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        self.run_with_urgency(false, f).await
    }

    /// Asynchronously runs an urgent DB operation that must never be skipped on page navigation.
    pub async fn run_urgent<F, R>(&self, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        self.run_with_urgency(true, f).await
    }

    pub async fn run_with_urgency<F, R>(&self, urgent: bool, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        let task_epoch = self.view_epoch.load(Ordering::Relaxed);
        let view_epoch = self.view_epoch.clone();
        let (tx, rx) = oneshot::channel();

        let task = Box::new(move |conn: &mut Connection| {
            let is_stale = !urgent && view_epoch.load(Ordering::Relaxed) > task_epoch;
            if tx.is_closed() || is_stale {
                logger::info!(
                    "DB_TASK_SKIPPED",
                    "Skipping stale DB task on page navigation"
                );
                return;
            }
            let res = f(conn);
            let _ = tx.send(res);
        });

        self.sender
            .send(task)
            .map_err(|_| "DB worker channel disconnected".to_string())?;

        rx.await
            .map_err(|_| "Stale DB task skipped or disconnected".to_string())
    }

    /// Synchronously runs a DB operation on the dedicated DB thread (used by ThreadPool background workers).
    pub fn run_sync<F, R>(&self, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        self.run_sync_with_urgency(false, f)
    }

    /// Synchronously runs an urgent DB operation that must never be skipped on page navigation.
    pub fn run_sync_urgent<F, R>(&self, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        self.run_sync_with_urgency(true, f)
    }

    pub fn run_sync_with_urgency<F, R>(&self, urgent: bool, f: F) -> Result<R, String>
    where
        F: FnOnce(&Connection) -> R + Send + 'static,
        R: Send + 'static,
    {
        let task_epoch = self.view_epoch.load(Ordering::Relaxed);
        let view_epoch = self.view_epoch.clone();
        let (tx, rx) = mpsc::channel();

        let task = Box::new(move |conn: &mut Connection| {
            if !urgent && view_epoch.load(Ordering::Relaxed) > task_epoch {
                logger::info!(
                    "DB_SYNC_TASK_SKIPPED",
                    "Skipping stale sync DB task on page navigation"
                );
                return;
            }
            let res = f(conn);
            let _ = tx.send(res);
        });

        self.sender
            .send(task)
            .map_err(|_| "DB worker channel disconnected".to_string())?;

        rx.recv()
            .map_err(|_| "Stale sync DB task skipped or disconnected".to_string())
    }
}
