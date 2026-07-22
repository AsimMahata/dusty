import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { MediaDir, MediaType } from "../../types/media";

/*
dusty::api::media::get_media_of_type,
dusty::api::media::sync_media_database,
*/

const CMD_GET_MEDIA_OF_TYPE = 'get_media_of_type';
const CMD_SYNC_MEDIA_DATABASE = 'sync_media_database';

export async function getMediaOfTypeIPC(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    try {
        let result = await invoke<MediaDir[]>(CMD_GET_MEDIA_OF_TYPE, { path, mediaType });
        return result;
    } catch (error) {
        logger.error(`getMediaOfTypeIPC error: ${error}`);
        return [];
    }
}

export async function syncMediaDatabaseIPC(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    try {
        let result = await invoke<MediaDir[]>(CMD_SYNC_MEDIA_DATABASE, { path, mediaType });
        return result;
    } catch (error) {
        logger.error(`syncMediaDatabaseIPC error: ${error}`);
        return [];
    }
}
