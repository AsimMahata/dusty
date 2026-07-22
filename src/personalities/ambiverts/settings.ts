import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
IPC Commands:
dusty::api::settings::reset_database
*/

const CMD_RESET_DATABASE = "reset_database";

export async function resetDatabaseIPC(): Promise<boolean> {
    try {
        await invoke(CMD_RESET_DATABASE);
        return true;
    } catch (error) {
        logger.error(`resetDatabaseIPC error: ${error}`);
        throw error;
    }
}
