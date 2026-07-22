import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";

/*
dusty::api::zip::scan_zip,
dusty::api::zip::sync_scan_zip,
*/

const CMD_SCAN_ZIP = 'scan_zip';
const CMD_SYNC_SCAN_ZIP = 'sync_scan_zip';

export async function scanZipIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_ZIP);
        return result;
    } catch (error) {
        logger.error(`scanZipIPC error: ${error}`);
        return [];
    }
}

export async function syncScanZipIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_ZIP);
        return result;
    } catch (error) {
        logger.error(`syncScanZipIPC error: ${error}`);
        return [];
    }
}
