import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";

/*
IPC Commands:
dusty::api::exe::scan_exe
dusty::api::exe::sync_scan_exe
dusty::api::exe::reset_exe_cache_table
*/

const CMD_SCAN_EXE = "scan_exe";
const CMD_SYNC_SCAN_EXE = "sync_scan_exe";
const CMD_RESET_EXE_CACHE_TABLE = "reset_exe_cache_table";

export async function scanExeIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_EXE);
        return result;
    } catch (error) {
        logger.error(`scanExeIPC error: ${error}`);
        return [];
    }
}

export async function syncScanExeIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_EXE);
        return result;
    } catch (error) {
        logger.error(`syncScanExeIPC error: ${error}`);
        return [];
    }
}

export async function resetExeCacheTableIPC(): Promise<void> {
    try {
        await invoke(CMD_RESET_EXE_CACHE_TABLE);
    } catch (error) {
        logger.error(`resetExeCacheTableIPC error: ${error}`);
    }
}
