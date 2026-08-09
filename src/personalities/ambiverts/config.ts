import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
dusty::api::config::get_config_value,
dusty::api::config::add_or_update_config_value,
dusty::api::config::reset_config,
*/

const CMD_GET_CONFIG_VALUE = "get_config_value";
const CMD_ADD_OR_UPDATE_CONFIG_VALUE = "add_or_update_config_value";
const CMD_RESET_CONFIG = "reset_config";

export async function getConfigValueIPC(id: string): Promise<string | null> {
    try {
        let result = await invoke<string | null>(CMD_GET_CONFIG_VALUE, { id });
        return result;
    } catch (error) {
        logger.error(`getConfigValueIPC error: ${error}`);
        return null;
    }
}

export async function addOrUpdateConfigValueIPC(id: string, value: string): Promise<boolean> {
    try {
        await invoke<void>(CMD_ADD_OR_UPDATE_CONFIG_VALUE, { id, value });
        return true;
    } catch (error) {
        logger.error(`addOrUpdateConfigValueIPC error: ${error}`);
        throw error;
    }
}

export async function resetConfigIPC(): Promise<boolean> {
    try {
        await invoke<void>(CMD_RESET_CONFIG);
        return true;
    } catch (error) {
        logger.error(`resetConfigIPC error: ${error}`);
        throw error;
    }
}

// Deprecated aliases for backwards compatibility
export const getValueBySessionIdIPC = async (id: string): Promise<string> => {
    const val = await getConfigValueIPC(id);
    if (val === null) {
        throw new Error(`Config '${id}' not found`);
    }
    return val;
};
export const addOrUpdateBySessionIdIPC = addOrUpdateConfigValueIPC;
export const resetSessionCacheIPC = resetConfigIPC;
