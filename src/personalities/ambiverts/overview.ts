import { invoke } from '@tauri-apps/api/core';
import { CMD_GET_STATS } from '../../constants/commands';
import type { BackendStats } from "../../types/system";

export async function getOverviewStatsFromBackend(): Promise<BackendStats> {
    return invoke<BackendStats>(CMD_GET_STATS);
}
