import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_MUSIC, CMD_SYNC_SCAN_MUSIC } from '../../constants/commands';
import type { FileInfo } from "../../types/media";

export async function scanMusic(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_MUSIC, { path });
}
export async function syncScanMusic(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_MUSIC, { path });
}
