import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { SystemInfoData } from "../../pages/home/types/types";

/*
dusty::api::system::get_system_info,
*/

const CMD_GET_SYSTEM_INFO = 'get_system_info';
const CMD_PAGE_CHANGED = 'page_changed';

export async function getSystemInfoIPC(): Promise<SystemInfoData> {
    try {
        let result = await invoke<SystemInfoData>(CMD_GET_SYSTEM_INFO);
        return result;
    } catch (error) {
        logger.error(`getSystemInfoIPC error: ${error}`);
        return null as any;
    }
}

export async function notifyPageChangedIPC(): Promise<void> {
    try {
        await invoke(CMD_PAGE_CHANGED);
    } catch (error) {
        logger.error(`notifyPageChangedIPC error: ${error}`);
    }
}

