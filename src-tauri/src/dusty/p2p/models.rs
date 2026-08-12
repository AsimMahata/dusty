use serde::Deserialize;
use serde::Serialize;
use uuid::Uuid;

use crate::dusty::models::shows::ShowResult;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TransferItem {
    File { path: String },
    Show { show: ShowResult },
}

impl TransferItem {
    pub fn all_file_paths(&self) -> Vec<String> {
        match self {
            TransferItem::File { path } => vec![path.clone()],
            TransferItem::Show { show } => show
                .episodes
                .iter()
                .map(|e| e.path.to_string_lossy().to_string())
                .collect(),
        }
    }

    pub fn display_name(&self) -> String {
        match self {
            TransferItem::File { path } => std::path::Path::new(path)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or(path)
                .to_string(),
            TransferItem::Show { show } => format!("Show: {}", show.title),
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ReceiverHandshake {
    pub transfer_key: String,
    pub id: Option<String>,
    pub name: Option<String>,
    pub hostname: Option<String>,
    pub ip_addresses: Vec<String>,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Peer {
    id: Uuid,
    name: String,
    hostname: String,
    addresses: Vec<String>,
    tcp_port: u16,
}

impl Peer {
    pub fn new(
        id: Uuid,
        name: String,
        hostname: String,
        addresses: Vec<String>,
        tcp_port: u16,
    ) -> Self {
        Self {
            id,
            name,
            hostname,
            addresses,
            tcp_port,
        }
    }

    pub fn peer_automatic_ip_address(
        id: Uuid,
        name: String,
        hostname: String,
        tcp_port: u16,
    ) -> Self {
        Self {
            id,
            name,
            hostname,
            addresses: Vec::new(),
            tcp_port,
        }
    }

    pub fn id(&self) -> Uuid {
        self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn hostname(&self) -> &str {
        &self.hostname
    }

    pub fn addresses(&self) -> &Vec<String> {
        &self.addresses
    }

    pub fn tcp_port(&self) -> u16 {
        self.tcp_port
    }

    pub fn add_address(&mut self, address: String) {
        self.addresses.push(address);
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SenderInfo {
    peer: Peer,
    transfer_key: String,
    #[serde(default)]
    files: Vec<String>,
    #[serde(default)]
    items: Vec<TransferItem>,
    created_at: u64,
    timeout_secs: u64,
}

impl SenderInfo {
    pub fn new(
        peer: Peer,
        transfer_key: String,
        files: Vec<String>,
        items: Vec<TransferItem>,
        created_at: u64,
        timeout_secs: u64,
    ) -> Self {
        Self {
            peer,
            transfer_key,
            files,
            items,
            created_at,
            timeout_secs,
        }
    }

    pub fn peer(&self) -> &Peer {
        &self.peer
    }

    pub fn transfer_key(&self) -> &str {
        &self.transfer_key
    }

    pub fn files(&self) -> &Vec<String> {
        &self.files
    }

    pub fn items(&self) -> &Vec<TransferItem> {
        &self.items
    }

    pub fn created_at(&self) -> u64 {
        self.created_at
    }

    pub fn timeout_secs(&self) -> u64 {
        self.timeout_secs
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferFileProgress {
    pub name: String,
    pub progress: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveTransfer {
    pub id: String,
    pub sender_name: String,
    pub receiver_name: String,
    pub files: Vec<TransferFileProgress>,
    pub overall_progress: f64,
    pub status: String,
    pub role: String,
    pub total_time_secs: Option<f64>,
    pub destination_path: Option<String>,
    pub total_bytes: Option<u64>,
    pub speed_bytes_per_sec: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutgoingRequestState {
    pub id: String,
    #[serde(default)]
    pub files: Vec<String>,
    #[serde(default)]
    pub items: Vec<TransferItem>,
    pub status: String,
    pub created_at: u64,
    pub timeout_secs: u64,
    pub receiver_name: Option<String>,
}

impl OutgoingRequestState {
    pub fn get_items(&self) -> Vec<TransferItem> {
        if !self.items.is_empty() {
            self.items.clone()
        } else {
            self.files
                .iter()
                .map(|p| TransferItem::File { path: p.clone() })
                .collect()
        }
    }

    pub fn all_file_paths(&self) -> Vec<String> {
        let mut result = Vec::new();
        for item in self.get_items() {
            result.extend(item.all_file_paths());
        }
        result
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct P2PCurrentState {
    pub mode: String, // "send", "receive", or "transfer"
    pub active_transfer: Option<ActiveTransfer>,
    pub outgoing_request: Option<OutgoingRequestState>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PendingTransfer {
    pub id: String,
    pub sender_name: String,
    pub sender_ips: Vec<String>,
    pub sender_port: u16,
    #[serde(default)]
    pub files: Vec<String>,
    #[serde(default)]
    pub items: Vec<TransferItem>,
    pub created_at: u64,
    pub timeout_secs: u64,
}

pub(crate) struct InternalP2PState {
    pub mode: String,
    pub active_transfer: Option<ActiveTransfer>,
    pub pending_transfers: Vec<PendingTransfer>,
}

pub(crate) static CANCEL_FLAG: std::sync::atomic::AtomicBool =
    std::sync::atomic::AtomicBool::new(false);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestFile {
    pub idx: usize,
    pub name: String,
    pub size: u64,
    pub relative_path: Option<String>,
    pub item_index: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestPayload {
    pub items: Vec<TransferItem>,
    pub files: Vec<ManifestFile>,
    pub total_bytes: u64,
}