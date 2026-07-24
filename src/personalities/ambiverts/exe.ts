import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { MiscDir } from "../../pages/misc/types/types";
import type { FileInfo } from "../../types/core";

/*
IPC Commands:
dusty::api::exe::scan_exe
dusty::api::exe::sync_scan_exe
dusty::api::exe::scan_exe_tree
dusty::api::exe::sync_scan_exe_tree
dusty::api::exe::reset_exe_cache_table
*/

const CMD_SCAN_EXE = "scan_exe";
const CMD_SYNC_SCAN_EXE = "sync_scan_exe";
const CMD_SCAN_EXE_TREE = "scan_exe_tree";
const CMD_SYNC_SCAN_EXE_TREE = "sync_scan_exe_tree";
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

export async function scanExeTreeIPC(): Promise<MiscDir[]> {
    try {
        let result = await invoke<MiscDir[]>(CMD_SCAN_EXE_TREE);
        return result;
    } catch (error) {
        logger.error(`scanExeTreeIPC error: ${error}`);
        return [];
    }
}

export async function syncScanExeTreeIPC(): Promise<MiscDir[]> {
    try {
        let result = await invoke<MiscDir[]>(CMD_SYNC_SCAN_EXE_TREE);
        return result;
    } catch (error) {
        logger.error(`syncScanExeTreeIPC error: ${error}`);
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
