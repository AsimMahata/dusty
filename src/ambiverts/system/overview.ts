import { invoke } from '@tauri-apps/api/core';
import { CMD_GET_STATS } from '../../constants/commands';

export interface BackendStats {
    shows: number | null;
    projects: number | null;
    songs: number | null;
    videos: number | null;
    images: number | null;
    zips: number | null;
    empty_dir: number | null;
}

export async function getOverviewStatsFromBackend(): Promise<BackendStats> {
    return invoke<BackendStats>(CMD_GET_STATS);
}
