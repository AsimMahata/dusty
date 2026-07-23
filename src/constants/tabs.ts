import type { Tab, TabType } from "../types/tabs";

// Titles
export const TITLE_SHOWS = "Shows";
export const TITLE_BANNED = "Banned Shows";
const TITLE_EXPLORER = "Explorer";
const TITLE_MEDIA_LIST = "Media List";
export const TITLE_EMPTY_DIRECTORIES = "Empty Directories";
export const TITLE_EXE_FILES = "Executable Files";
export const TITLE_JSON_FILES = "JSON Files";
export const TITLE_TEXT_FILES = "Text Files";
export const TITLE_OFFICE_FILES = "Office Files";
export const TITLE_COMING_SOON = "Coming Soon";
export const TITLE_GENERAL = "General";
export const TITLE_DATA = "Data";
export const TITLE_MUSIC_FOLDERS = "Music Folders";
export const TITLE_VIDEO_FOLDERS = "Video Folders";
export const TITLE_IMAGE_FOLDERS = "Image Folders";
export const TITLE_FOLDERS = "Folders";

// Types
export const TYPE_NORMAL: TabType = "normal";
export const TYPE_BANNED: TabType = "banned";
const TYPE_MEDIA: TabType = "media";
const TYPE_FOLDERS: TabType = "folders";
export const TYPE_EMPTY_DIRECTORIES = "empty_directories";
export const TYPE_EXE_FILES = "exe_files";
export const TYPE_JSON_FILES = "json_files";
export const TYPE_TEXT_FILES = "text_files";
export const TYPE_OFFICE_FILES = "office_files";
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

export const mediaExplorerTab: Tab = {
    title: TITLE_EXPLORER,
    type: TYPE_FOLDERS
}

export const mediaListTab: Tab = {
    title: TITLE_MEDIA_LIST,
    type: TYPE_MEDIA
}
