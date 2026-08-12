use serde::Deserialize;
use serde::Serialize;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: String,
    pub display_name: String,
    pub avatar: Option<String>,
    pub hostname: String,
    pub device_name: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DeviceInfo {
    pub hostname: String,
    pub os: String,
    pub device_name: String,
}
