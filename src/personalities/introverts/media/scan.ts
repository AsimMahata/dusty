import { scanVideoIPC, syncScanVideoIPC } from '../../ambiverts/video';
import { scanMusicIPC, syncScanMusicIPC } from '../../ambiverts/music';
import { scanImageIPC, syncScanImageIPC } from '../../ambiverts/image';
import { getMediaOfTypeIPC, syncMediaDatabaseIPC } from '../../ambiverts/media';
import { logger } from '../../../utility/logger';
import type { FileInfo } from "../../../types/core";
import type { MediaType, MediaDir } from "../../../components/media/types/types";

export async function fetchMediaTree(mediaType: MediaType, paths: string[], sync: boolean = false): Promise<MediaDir[]> {
    let allDirs: MediaDir[] = [];
    for (const path of paths) {
        try {
            const dirs = sync ? await syncMediaDatabaseIPC(path, mediaType) : await getMediaOfTypeIPC(path, mediaType);
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
                files = sync ? await syncScanVideoIPC(path) : await scanVideoIPC(path);
            } else if (mediaType === 'music') {
                files = sync ? await syncScanMusicIPC(path) : await scanMusicIPC(path);
            } else if (mediaType === 'image') {
                files = sync ? await syncScanImageIPC(path) : await scanImageIPC(path);
            }
            allFiles = [...allFiles, ...files];
        } catch (err) {
            logger.error(`Failed to fetch flat media for ${mediaType} from ${path}`, err);
        }
    }
    // Remove duplicates based on file path
    return Array.from(new Map(allFiles.map(item => [item.path, item])).values());
}
