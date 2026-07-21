import { invoke } from '@tauri-apps/api/core';
import { CMD_GET_MEDIA_OF_TYPE, CMD_SYNC_MEDIA_DATABASE } from '../../constants/commands';
import type { MediaDir, MediaType } from "../../types/media";

export async function getMediaOfTypeFromBackend(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    return invoke<MediaDir[]>(CMD_GET_MEDIA_OF_TYPE, { path, mediaType });
}

export async function syncMediaDatabaseFromBackend(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    return invoke<MediaDir[]>(CMD_SYNC_MEDIA_DATABASE, { path, mediaType });
}
