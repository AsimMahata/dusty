import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";

/*
IPC Commands:
dusty::api::empty_dir::scan_empty_dir
dusty::api::empty_dir::sync_scan_empty_dir
*/

const CMD_SCAN_EMPTY_DIR = "scan_empty_dir";
const CMD_SYNC_SCAN_EMPTY_DIR = "sync_scan_empty_dir";

export async function scanEmptyDirIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_EMPTY_DIR);
        return result;
    } catch (error) {
        logger.error(`scanEmptyDirIPC error: ${error}`);
        return [];
    }
}

export async function syncScanEmptyDirIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_EMPTY_DIR);
        return result;
    } catch (error) {
        logger.error(`syncScanEmptyDirIPC error: ${error}`);
        return [];
    }
}
