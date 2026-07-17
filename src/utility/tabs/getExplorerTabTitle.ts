import type { MediaType } from '../../types/types';
import { TITLE_MUSIC_FOLDERS, TITLE_VIDEO_FOLDERS, TITLE_IMAGE_FOLDERS, TITLE_FOLDERS } from '../../constants/tabs';

export const getExplorerTabTitle = (mediaType: MediaType) => {
    return 'Sources';
};
