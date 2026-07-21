import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_IMAGE, CMD_SYNC_SCAN_IMAGE } from '../../constants/commands';
import type { FileInfo } from "../../types/media";

export async function scanImage(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SCAN_IMAGE, { path });
}
export async function syncScanImage(path: string): Promise<FileInfo[]> {
    return invoke<FileInfo[]>(CMD_SYNC_SCAN_IMAGE, { path });
}
