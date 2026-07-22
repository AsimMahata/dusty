import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
IPC Commands:
dusty::api::lab::tokenize
dusty::api::lab::get_all_table_data
*/

const CMD_TOKENIZE = "tokenize";
const CMD_GET_ALL_TABLE_DATA = "get_all_table_data";

export async function tokenizeIPC(input: string): Promise<string[]> {
    try {
        let result = await invoke<string[]>(CMD_TOKENIZE, { input });
        return result;
    } catch (error) {
        logger.error(`tokenizeIPC error: ${error}`);
        return [];
    }
}

export async function getAllTableDataIPC(): Promise<Record<string, any[]>> {
    try {
        let result = await invoke<Record<string, any[]>>(CMD_GET_ALL_TABLE_DATA);
        return result;
    } catch (error) {
        logger.error(`getAllTableDataIPC error: ${error}`);
        return {};
    }
}
