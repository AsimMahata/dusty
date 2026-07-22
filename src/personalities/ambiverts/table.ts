import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
IPC Commands:
dusty::api::table::get_all_tables
dusty::api::table::reset_table
dusty::api::table::resync_table
*/

const CMD_GET_ALL_TABLES = "get_all_tables";
const CMD_RESET_TABLE = "reset_table";
const CMD_RESYNC_TABLE = "resync_table";

export async function getAllTablesIPC(): Promise<string[]> {
    try {
        let result = await invoke<string[]>(CMD_GET_ALL_TABLES);
        return result;
    } catch (error) {
        logger.error(`getAllTablesIPC error: ${error}`);
        return [];
    }
}

export async function resetTableIPC(tableName: string): Promise<boolean> {
    try {
        await invoke(CMD_RESET_TABLE, { tableName });
        return true;
    } catch (error) {
        logger.error(`resetTableIPC error: ${error}`);
        throw error;
    }
}

export async function resyncTableIPC(tableName: string): Promise<boolean> {
    try {
        await invoke(CMD_RESYNC_TABLE, { tableName });
        return true;
    } catch (error) {
        logger.error(`resyncTableIPC error: ${error}`);
        throw error;
    }
}
