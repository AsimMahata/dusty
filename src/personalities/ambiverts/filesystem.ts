import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
dusty::api::file_system::reveal_in_file_explorer,
dusty::api::opener::open_in_vs_code,
*/

const CMD_REVEAL_IN_FILE_EXPLORER = 'reveal_in_file_explorer';
const CMD_OPEN_IN_VS_CODE = 'open_in_vs_code';

export async function revealInFileExplorerIPC(path: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_REVEAL_IN_FILE_EXPLORER, { path });
        return result;
    } catch (error) {
        logger.error(`revealInFileExplorerIPC error: ${error}`);
        return false;
    }
}

export async function openInVsCodeIPC(path: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_OPEN_IN_VS_CODE, { path:path });
        return result;
    } catch (error) {
        logger.error(`openInVsCodeIPC error: ${error}`);
        return false;
    }
}
