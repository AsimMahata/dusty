pub struct Logger;

impl Logger {
    pub fn log(level: &str, tag: &str, file: &str, line: u32, pairs: &[(&str, String)]) {
        let mut msg = format!("{} (at {}:{})", tag, file, line);
        if !pairs.is_empty() {
            let width = pairs.iter().map(|(n, _)| n.len()).max().unwrap_or(0);
            for (name, val) in pairs {
                msg.push_str(&format!("\n    {:<width$} : {}", name, val, width = width));
            }
        }

        match level {
            "ERROR" => log::error!("{}", msg),
            "WARN" | "WARNING" | "TODO" => log::warn!("{}", msg),
            "DEBUG" => log::debug!("{}", msg),
            "TRACE" => log::trace!("{}", msg),
            _ => log::info!("{}", msg),
        }
    }
}

macro_rules! debug {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("DEBUG", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("DEBUG", $tag, file!(), line!(), pairs);
    }};
}

macro_rules! info {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("INFO", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("INFO", $tag, file!(), line!(), pairs);
    }};
}

macro_rules! warning {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("WARN", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("WARN", $tag, file!(), line!(), pairs);
    }};
}

macro_rules! error {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("ERROR", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("ERROR", $tag, file!(), line!(), pairs);
    }};
}

macro_rules! success {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("SUCCESS", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("SUCCESS", $tag, file!(), line!(), pairs);
    }};
}

macro_rules! todo {
    ($tag:expr) => {{
        $crate::dusty::logger::logger::Logger::log("TODO", $tag, file!(), line!(), &[]);
    }};
    ($tag:expr, $($val:expr),+ $(,)?) => {{
        let pairs: &[(&str, String)] = &[$( (stringify!($val), format!("{:?}", $val)) ),+];
        $crate::dusty::logger::logger::Logger::log("TODO", $tag, file!(), line!(), pairs);
    }};
}

pub(crate) use debug;
pub(crate) use error;
pub(crate) use info;
pub(crate) use warning;
#[allow(unused_imports)]
pub(crate) use success;
#[allow(unused_imports)]
pub(crate) use todo;
