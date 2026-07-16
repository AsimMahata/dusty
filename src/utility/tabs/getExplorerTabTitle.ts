import type { MediaType } from '../../types/types';
import { TITLE_MUSIC_FOLDERS, TITLE_VIDEO_FOLDERS, TITLE_IMAGE_FOLDERS, TITLE_FOLDERS } from '../../constants/tabs';

export const getExplorerTabTitle = (mediaType: MediaType) => {
    switch (mediaType) {
        case 'music': return TITLE_MUSIC_FOLDERS;
        case 'video': return TITLE_VIDEO_FOLDERS;
        case 'image': return TITLE_IMAGE_FOLDERS;
        default: return TITLE_FOLDERS;
    }
};
