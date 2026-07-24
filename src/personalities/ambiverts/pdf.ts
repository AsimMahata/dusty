import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { MiscDir } from "../../pages/misc/types/types";
import type { FileInfo } from "../../types/core";

/*
IPC Commands:
dusty::api::pdf::scan_pdf
dusty::api::pdf::sync_scan_pdf
dusty::api::pdf::scan_pdf_tree
dusty::api::pdf::sync_scan_pdf_tree
*/

const CMD_SCAN_PDF = 'scan_pdf';
const CMD_SYNC_SCAN_PDF = 'sync_scan_pdf';
const CMD_SCAN_PDF_TREE = 'scan_pdf_tree';
const CMD_SYNC_SCAN_PDF_TREE = 'sync_scan_pdf_tree';

export async function scanPdfIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SCAN_PDF);
        return result;
    } catch (error) {
        logger.error(`scanPdfIPC error: ${error}`);
        return [];
    }
}

export async function syncScanPdfIPC(): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_SYNC_SCAN_PDF);
        return result;
    } catch (error) {
        logger.error(`syncScanPdfIPC error: ${error}`);
        return [];
    }
}

export async function scanPdfTreeIPC(): Promise<MiscDir[]> {
    try {
        let result = await invoke<MiscDir[]>(CMD_SCAN_PDF_TREE);
        return result;
    } catch (error) {
        logger.error(`scanPdfTreeIPC error: ${error}`);
        return [];
    }
}

export async function syncScanPdfTreeIPC(): Promise<MiscDir[]> {
    try {
        let result = await invoke<MiscDir[]>(CMD_SYNC_SCAN_PDF_TREE);
        return result;
    } catch (error) {
        logger.error(`syncScanPdfTreeIPC error: ${error}`);
        return [];
    }
}
