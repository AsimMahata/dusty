import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
dusty::api::terminal::get_available_terminals,
dusty::api::terminal::open_terminal_at_path,
*/

const CMD_GET_AVAILABLE_TERMINALS = "get_available_terminals";
const CMD_OPEN_TERMINAL_AT_PATH = "open_terminal_at_path";

export async function getAvailableTerminalsIPC(): Promise<string[]> {
    try {
        let result = await invoke<string[]>(CMD_GET_AVAILABLE_TERMINALS);
        return result;
    } catch (error) {
        logger.error(`getAvailableTerminalsIPC error: ${error}`);
        return [];
    }
}

export async function openTerminalAtPathIPC(path: string, terminal: string): Promise<boolean> {
    try {
        await invoke(CMD_OPEN_TERMINAL_AT_PATH, { path, terminal });
        return true;
    } catch (error) {
        logger.error(`openTerminalAtPathIPC error: ${error}`);
        return false;
    }
}
