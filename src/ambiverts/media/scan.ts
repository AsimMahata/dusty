import { invoke } from '@tauri-apps/api/core';
import {
    CMD_SCAN_VIDEO, CMD_SYNC_SCAN_VIDEO,
    CMD_SCAN_MUSIC, CMD_SYNC_SCAN_MUSIC,
    CMD_SCAN_IMAGE, CMD_SYNC_SCAN_IMAGE,
    CMD_GET_MEDIA_OF_TYPE, CMD_SYNC_MEDIA_DATABASE
} from '../../constants/commands';
import type { FileInfo, MediaDir, MediaType } from '../../types/types';

export async function getMediaOfTypeFromBackend(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    return invoke<MediaDir[]>(CMD_GET_MEDIA_OF_TYPE, { path, mediaType });
}

export async function syncMediaDatabaseFromBackend(path: string, mediaType: MediaType): Promise<MediaDir[]> {
    return invoke<MediaDir[]>(CMD_SYNC_MEDIA_DATABASE, { path, mediaType });
}

export async function scanVideo(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_VIDEO, { path });
}
export async function syncScanVideo(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_VIDEO, { path });
}
export async function scanMusic(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_MUSIC, { path });
}
export async function syncScanMusic(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_MUSIC, { path });
}
export async function scanImage(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_IMAGE, { path });
}
export async function syncScanImage(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_IMAGE, { path });
}
