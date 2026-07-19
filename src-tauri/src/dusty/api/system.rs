use serde::Serialize;
use std::env;
use sysinfo::{Disks, System};

#[derive(Serialize)]
pub struct DiskInfo {
    pub name: String,
    pub kind: String,
    pub file_system: String,
    pub total_space: u64,
    pub available_space: u64,
    pub is_removable: bool,
}

#[derive(Serialize)]
pub struct CpuInfo {
    pub name: String,
    pub cpu_usage: f32,
    pub frequency: u64,
}

#[derive(Serialize)]
pub struct ProcessInfo {
    pub pid: String,
    pub name: String,
    pub memory: u64,
    pub cpu_usage: f32,
}

#[derive(Serialize)]
pub struct SystemInfoData {
    pub username: Option<String>,
    pub os_version: Option<String>,
    pub hostname: Option<String>,
    pub uptime: u64,
    pub total_memory: u64,
    pub used_memory: u64,
    pub total_swap: u64,
    pub used_swap: u64,
    pub cpus: Vec<CpuInfo>,
    pub disks: Vec<DiskInfo>,
    pub processes: Vec<ProcessInfo>,
}

#[tauri::command]
pub fn get_system_info() -> Result<SystemInfoData, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let disks_info = Disks::new_with_refreshed_list();
    let mut disks = Vec::new();
    for disk in disks_info.list() {
        disks.push(DiskInfo {
            name: disk.name().to_string_lossy().to_string(),
            kind: format!("{:?}", disk.kind()),
            file_system: disk.file_system().to_string_lossy().to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
            is_removable: disk.is_removable(),
        });
    }

    let mut cpus = Vec::new();
    for cpu in sys.cpus() {
        cpus.push(CpuInfo {
            name: cpu.name().to_string(),
            cpu_usage: cpu.cpu_usage(),
            frequency: cpu.frequency(),
        });
    }

    // Limit processes to top 50 to avoid huge payload
    let mut procs: Vec<_> = sys.processes().iter().collect();
    procs.sort_by(|a, b| b.1.memory().cmp(&a.1.memory()));
    let mut processes = Vec::new();
    for (pid, process) in procs.into_iter().take(50) {
        processes.push(ProcessInfo {
            pid: pid.to_string(),
            name: process.name().to_string(),
            memory: process.memory(),
            cpu_usage: process.cpu_usage(),
        });
    }

    let username = env::var("USERNAME").or_else(|_| env::var("USER")).ok();

    Ok(SystemInfoData {
        username,
        os_version: System::os_version(),
        hostname: System::host_name(),
        uptime: System::uptime(),
        total_memory: sys.total_memory(),
        used_memory: sys.used_memory(),
        total_swap: sys.total_swap(),
        used_swap: sys.used_swap(),
        cpus,
        disks,
        processes,
    })
}
