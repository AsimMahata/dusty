import { invoke } from '@tauri-apps/api/core';
import { CMD_REVEAL_IN_FILE_EXPLORER, CMD_OPEN_IN_VS_CODE } from '../../constants/commands';
import { logger } from '../../utility/logger';

export const revealInFileExplorer = async (path: string): Promise<boolean> => {
    try {
        await invoke(CMD_REVEAL_IN_FILE_EXPLORER, { path });
        return true;
    } catch (err) {
        logger.error(`Failed to open file in explorer: ${String(err)}`);
        return false;
    }
};

export const openInVsCodeOnBackend = async (path: string): Promise<boolean> => {
    try {
        await invoke(CMD_OPEN_IN_VS_CODE, { path:path });
        return true;
    } catch (err) {
        logger.error(`Failed to open in VS Code on backend: ${String(err)}`);
        return false;
    }
};
