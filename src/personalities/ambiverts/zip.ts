import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/media";
import type { ZipDir } from "../../types/zip";

/*
IPC Commands:
dusty::api::zip::scan_zip
dusty::api::zip::sync_scan_zip
dusty::api::zip::scan_zip_tree
dusty::api::zip::sync_scan_zip_tree
*/

const CMD_SCAN_ZIP = 'scan_zip';
const CMD_SYNC_SCAN_ZIP = 'sync_scan_zip';
const CMD_SCAN_ZIP_TREE = 'scan_zip_tree';
const CMD_SYNC_SCAN_ZIP_TREE = 'sync_scan_zip_tree';

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

export async function scanZipTreeIPC(): Promise<ZipDir[]> {
    try {
        let result = await invoke<ZipDir[]>(CMD_SCAN_ZIP_TREE);
        return result;
    } catch (error) {
        logger.error(`scanZipTreeIPC error: ${error}`);
        return [];
    }
}

export async function syncScanZipTreeIPC(): Promise<ZipDir[]> {
    try {
        let result = await invoke<ZipDir[]>(CMD_SYNC_SCAN_ZIP_TREE);
        return result;
    } catch (error) {
        logger.error(`syncScanZipTreeIPC error: ${error}`);
        return [];
    }
}
