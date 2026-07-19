import { scanVideo, syncScanVideo, scanMusic, syncScanMusic, scanImage, syncScanImage, getMediaOfTypeFromBackend, syncMediaDatabaseFromBackend } from '../../ambiverts/media/scan';
import type { FileInfo, MediaType, MediaDir } from '../../types/types';
import { logger } from '../../utility/logger';

export async function fetchMediaTree(mediaType: MediaType, path: string, sync: boolean = false): Promise<MediaDir[]> {
    try {
        return sync ? await syncMediaDatabaseFromBackend(path, mediaType) : await getMediaOfTypeFromBackend(path, mediaType);
    } catch (err) {
        logger.error(`Failed to fetch media tree for ${mediaType}`, err);
        return [];
    }
}

export async function fetchFlatMedia(mediaType: MediaType, path: string, sync: boolean = false): Promise<FileInfo[]> {
    try {
        if (mediaType === 'video') {
            return sync ? await syncScanVideo(path) : await scanVideo(path);
        } else if (mediaType === 'music') {
            return sync ? await syncScanMusic(path) : await scanMusic(path);
        } else if (mediaType === 'image') {
            return sync ? await syncScanImage(path) : await scanImage(path);
        }
        return [];
    } catch (err) {
        logger.error(`Failed to fetch flat media for ${mediaType}`, err);
        return [];
    }
}
