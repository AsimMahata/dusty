import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { BackendStats } from "../../types/system";

/*
dusty::api::overview::get_stats,
*/

const CMD_GET_STATS = 'get_stats';

export async function getOverviewStatsIPC(): Promise<BackendStats> {
    try {
        let result = await invoke<BackendStats>(CMD_GET_STATS);
        return result;
    } catch (error) {
        logger.error(`getOverviewStatsIPC error: ${error}`);
        return null as any;
    }
}
