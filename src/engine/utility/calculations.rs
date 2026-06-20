use std::sync::OnceLock;

use crate::engine::utility::math::binary_exp_with_mod;

pub struct PrimePower {
    pub p_pow: Vec<i64>,
    pub p_pow_inv: Vec<i64>,
    pub p: i64,
    pub m: i64,
}

static PRIME_POWER: OnceLock<PrimePower> = OnceLock::new();

pub fn get_prime_power() -> &'static PrimePower {
    PRIME_POWER.get_or_init(|| {
        let p: i64 = 357;
        let m: i64 = 1e9 as i64 + 7;
        let mut p_pow: Vec<i64> = vec![1; p as usize];
        for i in 1..p as usize {
            p_pow[i] = (p * p_pow[i - 1]) % m;
        }
        let mut p_pow_inv: Vec<i64> = vec![1; p as usize];
        p_pow_inv[p as usize - 1] = binary_exp_with_mod(p_pow[p as usize - 1], m - 2, m);
        for i in (0..p - 1).rev() {
            p_pow_inv[i as usize] = (p_pow_inv[i as usize + 1] * p) % m;
        }
        PrimePower {
            p_pow,
            p_pow_inv,
            p,
            m,
        }
    })
}
