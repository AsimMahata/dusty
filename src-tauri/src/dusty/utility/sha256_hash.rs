use crate::dusty::filesystem::hash::sha256_string;

pub fn get_sha256_id(main: String, sub: String) -> String {
    sha256_string(&format!("{} {}", main, sub))
}
