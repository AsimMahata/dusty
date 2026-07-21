import { invoke } from '@tauri-apps/api/core';
import { CMD_GET_SYSTEM_INFO } from '../../constants/commands';
import type { SystemInfoData } from "../../types/system";

export async function getSystemInfoFromBackend(): Promise<SystemInfoData> {
    return invoke<SystemInfoData>(CMD_GET_SYSTEM_INFO);
}
