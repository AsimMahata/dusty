import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/core";

/*
dusty::api::music::scan_music,
dusty::api::music::sync_scan_music,
*/

const CMD_SCAN_MUSIC = 'scan_music';
const CMD_SYNC_SCAN_MUSIC = 'sync_scan_music';

export async function scanMusicIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_MUSIC, { path });
        return result;
    } catch (error) {
        logger.error(`scanMusicIPC error: ${error}`);
        return [];
    }
}

export async function syncScanMusicIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_MUSIC, { path });
        return result;
    } catch (error) {
        logger.error(`syncScanMusicIPC error: ${error}`);
        return [];
    }
}
