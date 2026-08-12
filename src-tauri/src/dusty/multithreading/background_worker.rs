use crate::dusty::logger::logger;
use std::sync::mpsc;
use std::thread;

pub type JobTask = Box<dyn FnOnce() + Send + 'static>;

pub struct BackgroundJob {
    pub name: String,
    pub task: JobTask,
}

#[derive(Clone)]
pub struct BackgroundWorker {
    sender: mpsc::Sender<BackgroundJob>,
}

impl BackgroundWorker {
    pub fn new() -> Self {
        let (sender, receiver) = mpsc::channel::<BackgroundJob>();

        thread::spawn(move || {
            logger::info!(
                "BACKGROUND_WORKER_STARTED",
                "Dedicated background worker thread started"
            );
            while let Ok(job) = receiver.recv() {
                logger::info!("BACKGROUND_JOB_START", &job.name);
                (job.task)();
                logger::info!("BACKGROUND_JOB_FINISHED", &job.name);
            }
            logger::info!(
                "BACKGROUND_WORKER_STOPPED",
                "Dedicated background worker thread stopped"
            );
        });

        Self { sender }
    }

    pub fn dispatch<F>(&self, name: impl Into<String>, task: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job_name = name.into();
        let job = BackgroundJob {
            name: job_name.clone(),
            task: Box::new(task),
        };

        if let Err(e) = self.sender.send(job) {
            logger::error!(
                "BACKGROUND_WORKER_DISPATCH_FAILED",
                job_name,
                format!("{:?}", e)
            );
        }
    }
}

impl Default for BackgroundWorker {
    fn default() -> Self {
        Self::new()
    }
}
