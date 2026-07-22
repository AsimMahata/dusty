import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";

/*
dusty::api::image::scan_image,
dusty::api::image::sync_scan_image,
*/

const CMD_SCAN_IMAGE = 'scan_image';
const CMD_SYNC_SCAN_IMAGE = 'sync_scan_image';

export async function scanImageIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_IMAGE, { path });
        return result;
    } catch (error) {
        logger.error(`scanImageIPC error: ${error}`);
        return [];
    }
}

export async function syncScanImageIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_IMAGE, { path });
        return result;
    } catch (error) {
        logger.error(`syncScanImageIPC error: ${error}`);
        return [];
    }
}
