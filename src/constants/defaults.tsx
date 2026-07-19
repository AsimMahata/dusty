import { Tv, File, PlayCircle, Folder } from "lucide-react";

// Paths
const isWindows = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes("windows");
export const DEFAULT_STARTING_PATHS = isWindows ? ["C:\\", "D:\\"] : ["/"];

// Icons
export const DEFAULT_ICON = <File size={18} />;
export const DEFAULT_SHOW_ICON = <PlayCircle size={18} />;
export const DEFAULT_FOLDER_ICON = <Folder size={18} />;
export const DEFAULT_FILE_ICON = <File size={18} />;
export const DEFAULT_TV_ICON = <Tv size={24} />;
