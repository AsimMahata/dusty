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
const CMD_READ_FILE = "read_file";
const CMD_WRITE_FILE = "write_file";
const CMD_APPEND_FILE = "append_file";
const CMD_COPY_FILE = "copy_file";
const CMD_MOVE_FILE = "move_file";
const CMD_RENAME_FILE = "rename_file";
const CMD_DELETE_FILE = "delete_file";
const CMD_CREATE_DIRECTORY = "create_directory";
const CMD_DELETE_DIRECTORY = "delete_directory";
const CMD_EXISTS = "exists";
const CMD_GET_METADATA = "get_metadata";

export interface FileMetadata {
    size: number;
    created?: number;
    modified?: number;
    is_dir: boolean;
    is_file: boolean;
}

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

export async function readFileIPC(path: string): Promise<string> {
    try {
        return await invoke<string>(CMD_READ_FILE, { path });
    } catch (error) {
        logger.error(`readFileIPC error: ${error}`);
        throw error;
    }
}

export async function writeFileIPC(path: string, content: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_WRITE_FILE, { path, content });
    } catch (error) {
        logger.error(`writeFileIPC error: ${error}`);
        return false;
    }
}

export async function appendFileIPC(path: string, content: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_APPEND_FILE, { path, content });
    } catch (error) {
        logger.error(`appendFileIPC error: ${error}`);
        return false;
    }
}

export async function copyFileIPC(src: string, dst: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_COPY_FILE, { src, dst });
    } catch (error) {
        logger.error(`copyFileIPC error: ${error}`);
        return false;
    }
}

export async function moveFileIPC(src: string, dst: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_MOVE_FILE, { src, dst });
    } catch (error) {
        logger.error(`moveFileIPC error: ${error}`);
        return false;
    }
}

export async function renameFileIPC(src: string, dst: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_RENAME_FILE, { src, dst });
    } catch (error) {
        logger.error(`renameFileIPC error: ${error}`);
        return false;
    }
}

export async function deleteFileIPC(path: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_DELETE_FILE, { path });
    } catch (error) {
        logger.error(`deleteFileIPC error: ${error}`);
        return false;
    }
}

export async function createDirectoryIPC(path: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_CREATE_DIRECTORY, { path });
    } catch (error) {
        logger.error(`createDirectoryIPC error: ${error}`);
        return false;
    }
}

export async function deleteDirectoryIPC(path: string, recursive: boolean): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_DELETE_DIRECTORY, { path, recursive });
    } catch (error) {
        logger.error(`deleteDirectoryIPC error: ${error}`);
        return false;
    }
}

export async function existsIPC(path: string): Promise<boolean> {
    try {
        return await invoke<boolean>(CMD_EXISTS, { path });
    } catch (error) {
        logger.error(`existsIPC error: ${error}`);
        return false;
    }
}

export async function getMetadataIPC(path: string): Promise<FileMetadata | null> {
    try {
        return await invoke<FileMetadata>(CMD_GET_METADATA, { path });
    } catch (error) {
        logger.error(`getMetadataIPC error: ${error}`);
        return null;
    }
}
