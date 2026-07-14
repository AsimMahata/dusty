pub struct Logger;

impl Logger {
    pub fn log(level: &str, tag: &str, pairs: &[(&str, String)]) {
        println!("[{}]", level);
        println!("    {}\n", tag);
        let width = pairs.iter().map(|(n, _)| n.len()).max().unwrap_or(0);
        for (name, val) in pairs {
            println!("    {:<width$} : {}", name, val, width = width);
        }
        println!();
    }
}

macro_rules! debug {
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("DEBUG", $tag, pairs);
    }};
}

macro_rules! info {
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("INFO", $tag, pairs);
    }};
}

macro_rules! warning {
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("WARN", $tag, pairs);
    }};
}

macro_rules! error {
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("ERROR", $tag, pairs);
    }};
}

pub(crate) use debug;
pub(crate) use error;
pub(crate) use info;
pub(crate) use warning;
