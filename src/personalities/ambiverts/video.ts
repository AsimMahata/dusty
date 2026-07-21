import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_VIDEO, CMD_SYNC_SCAN_VIDEO } from '../../constants/commands';
import type { FileInfo } from "../../types/media";

export async function scanVideo(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_VIDEO, { path });
}
export async function syncScanVideo(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_VIDEO, { path });
}
