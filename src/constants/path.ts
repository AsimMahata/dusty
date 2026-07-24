// Paths
const isWindows =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("windows");

export const DEFAULT_STARTING_PATHS = isWindows
    ? ["C:\\", "D:\\"]
    : ["/"];
