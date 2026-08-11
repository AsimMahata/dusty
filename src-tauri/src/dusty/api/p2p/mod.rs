pub mod p2p;
pub mod sender;
pub mod receiver;
pub mod discovery;

pub use p2p::*;
pub use sender::*;
pub use receiver::*;
pub use discovery::*;

/// Local testing setup ports
pub const SENDER_DISCOVERY_PORT: u16 = 42069;
pub const SENDER_TRANSFER_PORT: u16 = 42070;
pub const RECEIVER_DISCOVERY_PORT: u16 = 42071;
pub const RECEIVER_TRANSFER_PORT: u16 = 42072;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct ReceiverHandshake {
    pub transfer_key: String,
    pub id: Option<String>,
    pub name: Option<String>,
    pub hostname: Option<String>,
    pub ip_addresses: Vec<String>,
}
