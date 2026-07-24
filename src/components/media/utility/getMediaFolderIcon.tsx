import { DEFAULT_FOLDER_ICON, ICONS } from '../../../constants/icon';
import type { MediaType } from "../types/types";

export const getMediaFolderIcon = (mediaType: MediaType) => {
    switch (mediaType) {
        case 'music': return ICONS.MEDIA_FOLDER.MUSIC;
        case 'video': return ICONS.MEDIA_FOLDER.VIDEO;
        case 'image': return ICONS.MEDIA_FOLDER.IMAGE;
        default: return DEFAULT_FOLDER_ICON;
    }
};
