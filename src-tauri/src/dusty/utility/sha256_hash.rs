use sha256::digest;

pub fn get_sha256_id(main: String, sub: String) -> String {
    let input: String = format!("{} {}", main, sub);
    digest(input)
}
