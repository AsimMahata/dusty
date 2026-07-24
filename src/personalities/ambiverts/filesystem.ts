import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { FileInfo } from "../../types/core";

/*
IPC Commands:
dusty::api::file_system::read_dir
dusty::api::file_system::reveal_in_file_explorer
dusty::api::opener::open_file
dusty::api::opener::open_in_vs_code
dusty::api::opener::open_url
*/

const CMD_READ_DIR = "read_dir";
const CMD_REVEAL_IN_FILE_EXPLORER = "reveal_in_file_explorer";
const CMD_OPEN_FILE = "open_file";
const CMD_OPEN_IN_VS_CODE = "open_in_vs_code";
const CMD_OPEN_URL = "open_url";

export async function readDirIPC(path: string): Promise<FileInfo[]> {
    try {
        let result = await invoke<FileInfo[]>(CMD_READ_DIR, { path });
        return result;
    } catch (error) {
        logger.error(`readDirIPC error: ${error}`);
        return [];
    }
}

export async function revealInFileExplorerIPC(path: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_REVEAL_IN_FILE_EXPLORER, { path });
        return result;
    } catch (error) {
        logger.error(`revealInFileExplorerIPC error: ${error}`);
        return false;
    }
}

export async function openFileIPC(path: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_OPEN_FILE, { path });
        return result;
    } catch (error) {
        logger.error(`openFileIPC error: ${error}`);
        return false;
    }
}

export async function openInVsCodeIPC(path: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_OPEN_IN_VS_CODE, { path });
        return result;
    } catch (error) {
        logger.error(`openInVsCodeIPC error: ${error}`);
        return false;
    }
}

export async function openUrlIPC(url: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_OPEN_URL, { url });
        return result;
    } catch (error) {
        logger.error(`openUrlIPC error: ${error}`);
        return false;
    }
}
