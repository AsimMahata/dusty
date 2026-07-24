import type { Tab, TabType } from "../../../types/tabs";

export const TITLE_EXPLORER = "Explorer";
export const TITLE_MEDIA_LIST = "Media List";
export const TITLE_MUSIC_FOLDERS = "Music Folders";
export const TITLE_VIDEO_FOLDERS = "Video Folders";
export const TITLE_IMAGE_FOLDERS = "Image Folders";
export const TITLE_FOLDERS = "Folders";

export const TYPE_MEDIA: TabType = "media";
export const TYPE_FOLDERS: TabType = "folders";

export const mediaExplorerTab: Tab = {
    title: TITLE_EXPLORER,
    type: TYPE_FOLDERS
};
export const mediaListTab: Tab = {
    title: TITLE_MEDIA_LIST,
    type: TYPE_MEDIA
};
