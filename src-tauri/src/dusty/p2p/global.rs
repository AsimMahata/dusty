use std::sync::Mutex;

use crate::dusty::p2p::InternalP2PState;

pub(crate) static P2P_STATE: Mutex<InternalP2PState> = Mutex::new(InternalP2PState {
    mode: String::new(),
    active_transfer: None,
    pending_transfers: Vec::new(),
});

pub const SENDER_DISCOVERY_PORT: u16 = 42069;
pub const SENDER_TRANSFER_PORT: u16 = 42070;
pub const RECEIVER_DISCOVERY_PORT: u16 = 42071;
pub const RECEIVER_TRANSFER_PORT: u16 = 42072;
