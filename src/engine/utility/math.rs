pub fn binary_exp_with_mod(a: i64, b: i64, m: i64) -> i64 {
    let mut res: i64 = 1;
    let mut p = b;
    let mut base = a;
    while p > 0 {
        if p % 2 == 1 {
            res = res * base % m;
        }
        p = p >> 1;
        base = base * base % m;
    }
    return res;
}
