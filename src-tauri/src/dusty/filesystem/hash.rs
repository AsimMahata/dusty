use sha256::digest;

pub fn sha256_string(input: &str) -> String {
    digest(input)
}
