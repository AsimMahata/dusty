use serde::Deserialize;
use serde::Serialize;
use uuid::Uuid;

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
    files: Vec<String>,
    created_at: u64,
    timeout_secs: u64,
}

impl SenderInfo {
    pub fn new(
        peer: Peer,
        transfer_key: String,
        files: Vec<String>,
        created_at: u64,
        timeout_secs: u64,
    ) -> Self {
        Self {
            peer,
            transfer_key,
            files,
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
    pub files: Vec<String>,
    pub status: String,
    pub created_at: u64,
    pub timeout_secs: u64,
    pub receiver_name: Option<String>,
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
    pub files: Vec<String>,
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

#[derive(serde::Deserialize)]
pub struct ManifestItem {
    pub idx: usize,
    pub name: String,
    pub size: u64,
}
#[derive(serde::Deserialize)]
pub struct ManifestPayload {
    pub files: Vec<ManifestItem>,
    pub total_bytes: u64,
}
