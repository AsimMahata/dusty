import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/core";

const CMD_SCAN_MISC = "scan_misc";
const CMD_SYNC_SCAN_MISC = "sync_scan_misc";
const CMD_SCAN_MISC_TREE = "scan_misc_tree";
const CMD_SYNC_SCAN_MISC_TREE = "sync_scan_misc_tree";
const CMD_RESET_MISC_CACHE = "reset_misc_cache_table";

export async function scanMiscIPC(miscType: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_MISC, { miscType });
        return result;
    } catch (error) {
        logger.error(`scanMiscIPC error for ${miscType}: ${error}`);
        return [];
    }
}

export async function syncScanMiscIPC(miscType: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_MISC, { miscType });
        return result;
    } catch (error) {
        logger.error(`syncScanMiscIPC error for ${miscType}: ${error}`);
        return [];
    }
}

export async function scanMiscTreeIPC<T = any>(miscType: string): Promise<T[]> {
    try {
        let result = await invoke<T[]>(CMD_SCAN_MISC_TREE, { miscType });
        return result;
    } catch (error) {
        logger.error(`scanMiscTreeIPC error for ${miscType}: ${error}`);
        return [];
    }
}

export async function syncScanMiscTreeIPC<T = any>(miscType: string): Promise<T[]> {
    try {
        let result = await invoke<T[]>(CMD_SYNC_SCAN_MISC_TREE, { miscType });
        return result;
    } catch (error) {
        logger.error(`syncScanMiscTreeIPC error for ${miscType}: ${error}`);
        return [];
    }
}

export async function resetMiscCacheIPC(miscType: string): Promise<void> {
    try {
        await invoke(CMD_RESET_MISC_CACHE, { miscType });
    } catch (error) {
        logger.error(`resetMiscCacheIPC error for ${miscType}: ${error}`);
    }
}
