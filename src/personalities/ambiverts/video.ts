import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";

/*
dusty::api::video::scan_video,
dusty::api::video::sync_scan_video,
*/

const CMD_SCAN_VIDEO = 'scan_video';
const CMD_SYNC_SCAN_VIDEO = 'sync_scan_video';

export async function scanVideoIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_VIDEO, { path });
        return result;
    } catch (error) {
        logger.error(`scanVideoIPC error: ${error}`);
        return [];
    }
}

export async function syncScanVideoIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_VIDEO, { path });
        return result;
    } catch (error) {
        logger.error(`syncScanVideoIPC error: ${error}`);
        return [];
    }
}
