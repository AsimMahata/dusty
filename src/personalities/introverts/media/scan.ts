import { scanVideo, syncScanVideo } from '../../ambiverts/video';
import { scanMusic, syncScanMusic } from '../../ambiverts/music';
import { scanImage, syncScanImage } from '../../ambiverts/image';
import { getMediaOfTypeFromBackend, syncMediaDatabaseFromBackend } from '../../ambiverts/media';
import { logger } from '../../../utility/logger';
import type { FileInfo, MediaType, MediaDir } from "../../../types/media";

export async function fetchMediaTree(mediaType: MediaType, paths: string[], sync: boolean = false): Promise<MediaDir[]> {
    let allDirs: MediaDir[] = [];
    for (const path of paths) {
        try {
            const dirs = sync ? await syncMediaDatabaseFromBackend(path, mediaType) : await getMediaOfTypeFromBackend(path, mediaType);
            allDirs = [...allDirs, ...dirs];
        } catch (err) {
            logger.error(`Failed to fetch media tree for ${mediaType} from ${path}`, err);
        }
    }
    // Remove duplicates based on ID (which is the directory path)
    return Array.from(new Map(allDirs.map(item => [item.id, item])).values());
}

export async function fetchFlatMedia(mediaType: MediaType, paths: string[], sync: boolean = false): Promise<FileInfo[]> {
    let allFiles: FileInfo[] = [];
    for (const path of paths) {
        try {
            let files: FileInfo[] = [];
            if (mediaType === 'video') {
                files = sync ? await syncScanVideo(path) : await scanVideo(path);
            } else if (mediaType === 'music') {
                files = sync ? await syncScanMusic(path) : await scanMusic(path);
            } else if (mediaType === 'image') {
                files = sync ? await syncScanImage(path) : await scanImage(path);
            }
            allFiles = [...allFiles, ...files];
        } catch (err) {
            logger.error(`Failed to fetch flat media for ${mediaType} from ${path}`, err);
        }
    }
    // Remove duplicates based on file path
    return Array.from(new Map(allFiles.map(item => [item.path, item])).values());
}
