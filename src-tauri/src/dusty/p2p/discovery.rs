use std::collections::HashMap;
use std::sync::mpsc;
use std::time::Duration;
use std::time::Instant;

use mdns_sd::ServiceDaemon;
use mdns_sd::ServiceEvent;
use mdns_sd::ServiceInfo;
use uuid::Uuid;

use crate::dusty::p2p::models::Peer;
use crate::dusty::p2p::models::SenderInfo;

pub struct Discovery {
    _daemon: ServiceDaemon,
    service_type: String,
    duration: Duration,
    service_port: u16,
}

impl Discovery {
    pub fn new(service_type: String, duration: u64, service_port: u16) -> Self {
        Self {
            _daemon: ServiceDaemon::new().expect("failed to create mDNS daemon"),
            service_type: service_type,
            duration: Duration::from_secs(duration),
            service_port: service_port,
        }
    }

    pub fn get_properties(&self, sender_info: &SenderInfo) -> HashMap<String, String> {
        let mut properties = HashMap::new();
        properties.insert("uuid".to_string(), sender_info.peer().id().to_string());
        properties.insert("name".to_string(), sender_info.peer().name().to_string());
        properties.insert(
            "hostname".to_string(),
            sender_info.peer().hostname().to_string(),
        );
        properties.insert(
            "tcp_port".to_string(),
            sender_info.peer().tcp_port().to_string(),
        );
        properties.insert(
            "transfer_key".to_string(),
            sender_info.transfer_key().to_string(),
        );
        properties.insert(
            "created_at".to_string(),
            sender_info.created_at().to_string(),
        );
        properties.insert(
            "timeout_secs".to_string(),
            sender_info.timeout_secs().to_string(),
        );

        let file_basenames: Vec<String> = sender_info
            .files()
            .iter()
            .map(|f| {
                std::path::Path::new(f)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or(f)
                    .to_string()
            })
            .collect();

        let total_count = file_basenames.len();
        let mut files_summary = String::new();
        let mut included_count = 0;

        for name in &file_basenames {
            let candidate = if files_summary.is_empty() {
                name.clone()
            } else {
                format!("{}, {}", files_summary, name)
            };

            let suffix = if included_count + 1 < total_count {
                format!(" (+{} more)", total_count - (included_count + 1))
            } else {
                String::new()
            };

            if candidate.len() + suffix.len() > 200 {
                break;
            }
            files_summary = candidate;
            included_count += 1;
        }

        if included_count < total_count {
            files_summary.push_str(&format!(" (+{} more)", total_count - included_count));
        }

        properties.insert("files".to_string(), files_summary);
        properties
    }

    pub fn broadcast(&self, sender_info: SenderInfo) -> Result<String, String> {
        let properties = self.get_properties(&sender_info);

        let raw_hostname = sender_info.peer().hostname();
        let formatted_hostname = if raw_hostname.ends_with(".local.") {
            raw_hostname.to_string()
        } else {
            format!("{}.local.", raw_hostname.trim_end_matches('.'))
        };

        let service = ServiceInfo::new(
            &self.service_type,
            sender_info.peer().name(),
            &formatted_hostname,
            "",
            self.service_port,
            properties,
        )
        .map_err(|e| format!("Failed to create ServiceInfo for mDNS: {}", e))?
        .enable_addr_auto();

        let service_name = service.get_fullname().to_string();

        self._daemon
            .register(service)
            .map_err(|e| format!("Failed to register mDNS service: {}", e))?;
        log::info!(
            "[SENDER] mDNS broadcast registered successfully on daemon (service_name: {})",
            service_name
        );
        Ok(service_name)
    }

    pub fn unregister(&self, service_name: &str) {
        if let Ok(rx) = self._daemon.unregister(service_name) {
            log::info!("[SENDER] mDNS service unregistered: {}", service_name);
            let _ = rx.recv_timeout(Duration::from_secs(2));
        }
    }

    pub fn shutdown(&self) {
        let _ = self._daemon.shutdown();
        log::info!("[SENDER] mDNS daemon shutdown.");
    }

    pub fn discover(&self, tx: mpsc::Sender<SenderInfo>) -> Result<(), String> {
        let receiver = self
            ._daemon
            .browse(&self.service_type)
            .map_err(|e| format!("Failed to browse mDNS service: {}", e))?;

        log::info!("[DISCOVERER] Looking for Dusty devices...");

        let start = Instant::now();

        while start.elapsed() < self.duration {
            match receiver.recv_timeout(Duration::from_secs(1)) {
                Ok(ServiceEvent::ServiceResolved(info)) => {
                    let mut addresses = Vec::new();
                    for address in info.get_addresses() {
                        addresses.push(address.to_string());
                    }

                    if let (Some(uuid_str), Some(port_str)) = (
                        info.get_property_val_str("uuid"),
                        info.get_property_val_str("tcp_port"),
                    ) {
                        if let Ok(id) = Uuid::parse_str(uuid_str) {
                            if let Ok(tcp_port) = port_str.parse::<u16>() {
                                let name = info
                                    .get_property_val_str("name")
                                    .map(|s| s.to_string())
                                    .unwrap_or_else(|| info.get_fullname().to_string());
                                let hostname = info
                                    .get_property_val_str("hostname")
                                    .map(|s| s.to_string())
                                    .unwrap_or_else(|| info.get_hostname().to_string());
                                let transfer_key = info
                                    .get_property_val_str("transfer_key")
                                    .map(|s| s.to_string())
                                    .unwrap_or_default();
                                let files: Vec<String> = info
                                    .get_property_val_str("files")
                                    .map(|s| {
                                        s.split(',')
                                            .map(|f| f.to_string())
                                            .filter(|f| !f.is_empty())
                                            .collect()
                                    })
                                    .unwrap_or_default();
                                let created_at: u64 = info
                                    .get_property_val_str("created_at")
                                    .and_then(|s| s.parse().ok())
                                    .unwrap_or(0);
                                let timeout_secs: u64 = info
                                    .get_property_val_str("timeout_secs")
                                    .and_then(|s| s.parse().ok())
                                    .unwrap_or(60);

                                let peer = Peer::new(id, name, hostname, addresses, tcp_port);
                                let sender_info = SenderInfo::new(
                                    peer,
                                    transfer_key,
                                    files,
                                    Vec::new(),
                                    created_at,
                                    timeout_secs,
                                );
                                let _ = tx.send(sender_info);
                            }
                        }
                    }
                }
                Ok(_) => {}
                Err(_) => {}
            }
        }

        let _ = self._daemon.stop_browse(&self.service_type);
        Ok(())
    }
}
