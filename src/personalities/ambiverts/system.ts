import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { SystemInfoData } from "../../types/system";

/*
dusty::api::system::get_system_info,
*/

const CMD_GET_SYSTEM_INFO = 'get_system_info';

export async function getSystemInfoIPC(): Promise<SystemInfoData> {
    try {
        let result = await invoke<SystemInfoData>(CMD_GET_SYSTEM_INFO);
        return result;
    } catch (error) {
        logger.error(`getSystemInfoIPC error: ${error}`);
        return null as any;
    }
}
