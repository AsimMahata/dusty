use crate::dusty::logger::logger;
use std::sync::mpsc;
use std::thread;

type P2PTask = Box<dyn FnOnce() + Send + 'static>;

#[derive(Clone)]
pub struct P2PWorker {
    sender: mpsc::Sender<P2PTask>,
}

impl P2PWorker {
    pub fn new() -> Self {
        let (sender, receiver) = mpsc::channel::<P2PTask>();

        thread::spawn(move || {
            logger::info!("P2P_WORKER_STARTED", "Dedicated P2P worker thread started");
            while let Ok(task) = receiver.recv() {
                task();
            }
            logger::info!("P2P_WORKER_STOPPED", "Dedicated P2P worker thread stopped");
        });

        Self { sender }
    }

    pub fn dispatch<F>(&self, f: F) -> Result<(), String>
    where
        F: FnOnce() + Send + 'static,
    {
        self.sender
            .send(Box::new(f))
            .map_err(|_| "P2P worker channel disconnected".to_string())
    }
}

impl Default for P2PWorker {
    fn default() -> Self {
        Self::new()
    }
}
