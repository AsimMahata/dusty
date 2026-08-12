use crate::dusty::logger::logger;
use std::sync::atomic::AtomicU64;
use std::sync::atomic::Ordering;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;

type JobFn = Box<dyn FnOnce() + Send + 'static>;

enum Task {
    NewTask {
        name: String,
        task_epoch: u64,
        urgent: bool,
        job: JobFn,
    },
    Terminate,
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl Worker {
    pub fn new(
        id: usize,
        task_receiver: Arc<Mutex<mpsc::Receiver<Task>>>,
        view_epoch: Arc<AtomicU64>,
    ) -> Worker {
        let thread = Some(thread::spawn(move || loop {
            let task = {
                let receiver = match task_receiver.lock() {
                    Ok(guard) => guard,
                    Err(poisoned) => {
                        logger::warning!("Worker acquired poisoned mutex lock", id);
                        poisoned.into_inner()
                    }
                };

                match receiver.recv() {
                    Ok(task) => task,
                    Err(_) => {
                        logger::debug!("Worker task channel disconnected", id);
                        break;
                    }
                }
            };

            match task {
                Task::NewTask {
                    name,
                    task_epoch,
                    urgent,
                    job,
                } => {
                    if !urgent && view_epoch.load(Ordering::Relaxed) > task_epoch {
                        logger::info!(
                            "THREAD_JOB_SKIPPED",
                            id,
                            name,
                            "Skipping stale ThreadPool job on page navigation"
                        );
                        continue;
                    }
                    logger::info!("THREAD executing job", id, name);
                    job();
                }
                Task::Terminate => {
                    logger::info!("Worker is being terminated", id);
                    break;
                }
            }
        }));
        Worker { id, thread }
    }
}

pub struct ThreadPool {
    size: usize,
    workers: Vec<Worker>,
    task_sender: mpsc::Sender<Task>,
    view_epoch: Arc<AtomicU64>,
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        for _ in 0..self.size {
            if let Err(e) = self.task_sender.send(Task::Terminate) {
                logger::error!("Failed to send Terminate task", e.to_string());
            }
        }
        logger::info!("DROPPING ThreadPool");
        for w in &mut self.workers {
            logger::info!("Shutting down worker", w.id);
            if let Some(thread) = w.thread.take() {
                if let Err(e) = thread.join() {
                    logger::error!("Worker thread panicked", w.id, e);
                }
            }
        }
    }
}

impl ThreadPool {
    pub fn new(size: usize, view_epoch: Arc<AtomicU64>) -> ThreadPool {
        assert!(size > 0);
        logger::info!("ThreadPool created with size", size);
        let (sender, receiver) = mpsc::channel::<Task>();
        let task_reciever = Arc::new(Mutex::new(receiver));
        let mut workers: Vec<Worker> = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(
                id,
                Arc::clone(&task_reciever),
                view_epoch.clone(),
            ));
        }
        ThreadPool {
            size,
            workers,
            task_sender: sender,
            view_epoch,
        }
    }

    pub fn execute<F>(&self, name: impl Into<String>, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        self.execute_with_urgency(name, false, f);
    }

    pub fn execute_urgent<F>(&self, name: impl Into<String>, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        self.execute_with_urgency(name, true, f);
    }

    pub fn execute_with_urgency<F>(&self, name: impl Into<String>, urgent: bool, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let name = name.into();
        let task_epoch = self.view_epoch.load(Ordering::Relaxed);
        let job = Box::new(f);
        if let Err(e) = self.task_sender.send(Task::NewTask {
            name: name.clone(),
            task_epoch,
            urgent,
            job,
        }) {
            logger::error!("Failed to send task to ThreadPool", name, e.to_string());
        } else {
            logger::info!("DISPATCHING_JOB", name);
        }
    }

    pub async fn execute_with_result<F, R>(
        &self,
        name: impl Into<String>,
        f: F,
    ) -> Result<R, String>
    where
        F: FnOnce() -> R + Send + 'static,
        R: Send + 'static,
    {
        self.execute_with_result_and_urgency(name, false, f).await
    }

    pub async fn execute_with_result_urgent<F, R>(
        &self,
        name: impl Into<String>,
        f: F,
    ) -> Result<R, String>
    where
        F: FnOnce() -> R + Send + 'static,
        R: Send + 'static,
    {
        self.execute_with_result_and_urgency(name, true, f).await
    }

    pub async fn execute_with_result_and_urgency<F, R>(
        &self,
        name: impl Into<String>,
        urgent: bool,
        f: F,
    ) -> Result<R, String>
    where
        F: FnOnce() -> R + Send + 'static,
        R: Send + 'static,
    {
        let (tx, rx) = tokio::sync::oneshot::channel();
        let name_str = name.into();
        self.execute_with_urgency(name_str, urgent, move || {
            if tx.is_closed() {
                logger::info!(
                    "THREAD_JOB_SKIPPED",
                    "Skipping unstarted ThreadPool job (receiver dropped)"
                );
                return;
            }
            let res = f();
            let _ = tx.send(res);
        });

        rx.await
            .map_err(|_| "Stale ThreadPool job skipped or disconnected".to_string())
    }
}
