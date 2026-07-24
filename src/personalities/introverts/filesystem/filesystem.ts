import { revealInFileExplorerIPC, openInVsCodeIPC, openFileIPC, readDirIPC, openUrlIPC } from '../../ambiverts/filesystem';
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
