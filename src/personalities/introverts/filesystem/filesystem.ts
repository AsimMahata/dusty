import { revealInFileExplorerIPC, openInVsCodeIPC } from '../../ambiverts/filesystem';
import { logger } from '../../../utility/logger';

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
