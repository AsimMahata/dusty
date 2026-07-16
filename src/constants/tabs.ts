import type { Tab, TabType } from "../types/types"

// Titles
export const TITLE_SHOWS = "Shows";
export const TITLE_BANNED = "Banned Shows";
export const TITLE_MUSIC_DIR = "Music Dir";
export const TITLE_SONGS = "Songs";
export const TITLE_EXPLORER = "Explorer";
export const TITLE_MEDIA_LIST = "Media List";
export const TITLE_PROJECTS = "Projects";
export const TITLE_EMPTY_DIRECTORIES = "Empty Directories";
export const TITLE_COMING_SOON = "Coming Soon";
export const TITLE_GENERAL = "General";
export const TITLE_DATA = "Data";

// Types
export const TYPE_NORMAL: TabType = "normal";
export const TYPE_BANNED: TabType = "banned";
export const TYPE_MEDIA: TabType = "media";
export const TYPE_MUSIC: TabType = "music";
export const TYPE_FOLDERS: TabType = "folders";
export const TYPE_EMPTY_DIRECTORIES = "empty_directories";
export const TYPE_COMING_SOON = "coming_soon";
export const TYPE_GENERAL = "general";
export const TYPE_DATA = "data";

// Tab Objects

export const showTab: Tab = {
    title: TITLE_SHOWS,
    type: TYPE_NORMAL,
}
export const showBannedTab: Tab = {
    title: TITLE_BANNED,
    type: TYPE_BANNED
}

export const musicDirTab: Tab = {
    title: TITLE_MUSIC_DIR,
    type: TYPE_MEDIA
}
export const musicTab: Tab = {
    title: TITLE_SONGS,
    type: TYPE_MUSIC
}
export const mediaExplorerTab: Tab = {
    title: TITLE_EXPLORER,
    type: TYPE_FOLDERS
}

export const mediaListTab: Tab = {
    title: TITLE_MEDIA_LIST,
    type: TYPE_MEDIA
}
