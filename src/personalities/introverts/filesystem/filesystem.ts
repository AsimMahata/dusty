import { 
    revealInFileExplorerIPC, openInVsCodeIPC, openFileIPC, readDirIPC, openUrlIPC,
    readFileIPC, writeFileIPC, appendFileIPC, copyFileIPC, moveFileIPC,
    renameFileIPC, deleteFileIPC, createDirectoryIPC, deleteDirectoryIPC,
    existsIPC, getMetadataIPC
} from '../../ambiverts/filesystem';
import type { FileMetadata } from '../../ambiverts/filesystem';
import { logger } from '../../../utility/logger';
import type { FileInfo } from "../../../types/core";

export const openFileInExplorer = async (path: string): Promise<boolean> => {
    try {
        const success = await revealInFileExplorerIPC(path);
        if (success) {
            logger.info(`Opened file in explorer: ${path}`);
        }
        return success;
    } catch (err) {
        logger.error(`Failed to open file in explorer: ${String(err)}`);
        return false;
    }
};

export const openInVsCode = async (path: string): Promise<boolean> => {
    try {
        const success = await openInVsCodeIPC(path);
        if (success) {
            logger.info(`Opened in VS Code: ${path}`);
        }
        return success;
    } catch (err) {
        logger.error(`Failed to open in VS Code: ${String(err)}`);
        return false;
    }
};

export const openFile = async (path: string): Promise<boolean> => {
    try {
        const success = await openFileIPC(path);
        if (success) {
            logger.info(`Opened file: ${path}`);
        }
        return success;
    } catch (err) {
        logger.error(`Failed to open file: ${String(err)}`);
        return false;
    }
};

export const readDir = async (path: string): Promise<FileInfo[]> => {
    try {
        return await readDirIPC(path);
    } catch (err) {
        logger.error(`Failed to read directory ${path}: ${String(err)}`);
        return [];
    }
};

export const openUrl = async (url: string): Promise<boolean> => {
    try {
        const success = await openUrlIPC(url);
        if (success) {
            logger.info(`Opened URL: ${url}`);
        }
        return success;
    } catch (err) {
        logger.error(`Failed to open URL: ${String(err)}`);
        return false;
    }
};

export const readFile = async (path: string): Promise<string> => {
    return await readFileIPC(path);
};

export const writeFile = async (path: string, content: string): Promise<boolean> => {
    return await writeFileIPC(path, content);
};

export const appendFile = async (path: string, content: string): Promise<boolean> => {
    return await appendFileIPC(path, content);
};

export const copyFile = async (src: string, dst: string): Promise<boolean> => {
    return await copyFileIPC(src, dst);
};

export const moveFile = async (src: string, dst: string): Promise<boolean> => {
    return await moveFileIPC(src, dst);
};

export const renameFile = async (src: string, dst: string): Promise<boolean> => {
    return await renameFileIPC(src, dst);
};

export const deleteFile = async (path: string): Promise<boolean> => {
    return await deleteFileIPC(path);
};

export const createDirectory = async (path: string): Promise<boolean> => {
    return await createDirectoryIPC(path);
};

export const deleteDirectory = async (path: string, recursive: boolean = false): Promise<boolean> => {
    return await deleteDirectoryIPC(path, recursive);
};

export const readDirectory = async (path: string) => {
    return await readDirIPC(path);
};

export const exists = async (path: string): Promise<boolean> => {
    return await existsIPC(path);
};

export const getMetadata = async (path: string): Promise<FileMetadata | null> => {
    return await getMetadataIPC(path);
};
