import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
dusty::api::session::get_value_by_session_id,
dusty::api::session::add_or_update_by_session_id,
dusty::api::session::reset_session_cache,
*/

const CMD_GET_VALUE_BY_SESSION_ID = "get_value_by_session_id";
const CMD_ADD_OR_UPDATE_BY_SESSION_ID = "add_or_update_by_session_id";
const CMD_RESET_SESSION_CACHE = "reset_session_cache";

export async function getValueBySessionIdIPC(id: string): Promise<string> {
    try {
        let result = await invoke<string>(CMD_GET_VALUE_BY_SESSION_ID, { id });
        return result;
    } catch (error) {
        const errStr = String(error);
        if (!errStr.includes("Session not found")) {
            logger.error(`getValueBySessionIdIPC error: ${error}`);
        }
        throw error;
    }
}

export async function addOrUpdateBySessionIdIPC(id: string, value: string): Promise<boolean> {
    try {
        await invoke<void>(CMD_ADD_OR_UPDATE_BY_SESSION_ID, { id, value });
        return true;
    } catch (error) {
        logger.error(`addOrUpdateBySessionIdIPC error: ${error}`);
        throw error;
    }
}

export async function resetSessionCacheIPC(): Promise<boolean> {
    try {
        await invoke<void>(CMD_RESET_SESSION_CACHE);
        return true;
    } catch (error) {
        logger.error(`resetSessionCacheIPC error: ${error}`);
        throw error;
    }
}
