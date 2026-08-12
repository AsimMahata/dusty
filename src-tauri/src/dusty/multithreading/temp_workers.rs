use crate::dusty::logger::logger;
use std::sync::mpsc;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;

pub fn temp_workers<F, R>(jobs: Vec<F>) -> Vec<R>
where
    F: FnOnce() -> R + Send + 'static,
    R: Send + 'static,
{
    if jobs.is_empty() {
        return Vec::new();
    }

    let total_jobs = jobs.len();
    let num_threads = thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4)
        .min(total_jobs)
        .min(4)
        .max(1);

    logger::info!("TEMP_WORKERS_START", total_jobs, num_threads);

    let (job_tx, job_rx) = mpsc::channel::<F>();
    let job_rx = Arc::new(Mutex::new(job_rx));

    let (res_tx, res_rx) = mpsc::channel::<R>();

    for job in jobs {
        if let Err(e) = job_tx.send(job) {
            logger::error!("Failed to enqueue job for temp worker", e.to_string());
        }
    }
    drop(job_tx);

    let mut handles = Vec::with_capacity(num_threads);
    for worker_id in 0..num_threads {
        let rx = Arc::clone(&job_rx);
        let tx = res_tx.clone();
        let handle = thread::spawn(move || loop {
            let job = {
                let guard = match rx.lock() {
                    Ok(guard) => guard,
                    Err(poisoned) => poisoned.into_inner(),
                };
                match guard.recv() {
                    Ok(job) => job,
                    Err(_) => break,
                }
            };

            logger::info!("TEMP_WORKER_EXECUTING_JOB", worker_id);
            let result = job();
            let _ = tx.send(result);
        });
        handles.push(handle);
    }
    drop(res_tx);
    let mut results = Vec::with_capacity(total_jobs);
    while let Ok(res) = res_rx.recv() {
        results.push(res);
    }

    for (worker_id, handle) in handles.into_iter().enumerate() {
        if let Err(e) = handle.join() {
            logger::error!("TEMP_WORKER_PANICKED", worker_id, format!("{:?}", e));
        }
    }

    logger::info!("TEMP_WORKERS_FINISHED", results.len());

    results
}
