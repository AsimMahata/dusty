import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { VideoItem } from "../../types/core";

/*
dusty::api::recent::get_recent_episodes,
dusty::api::recent::add_recent_episode,
dusty::api::recent::reset_recent_episodes_table,
*/

const CMD_GET_RECENT_VIEW_VIDEOS = 'get_recent_episodes';
const CMD_PUT_EPISODE_IN_RECENT = 'add_recent_episode';
const CMD_RESET_RECENT_EPISODES_TABLE = 'reset_recent_episodes_table';

export async function getRecentViewedEpisodesIPC(): Promise<VideoItem[]> {
    try {
        let result = await invoke<VideoItem[]>(CMD_GET_RECENT_VIEW_VIDEOS);
        return result;
    } catch (error) {
        logger.error(`getRecentViewedEpisodesIPC error: ${error}`);
        return [];
    }
}

export async function putEpisodeInRecentIPC(video: VideoItem): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_PUT_EPISODE_IN_RECENT, { video: video });
        return result;
    } catch (error) {
        logger.error(`putEpisodeInRecentIPC error: ${error}`);
        return false;
    }
}

export async function resetRecentEpisodesTableIPC(): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_RESET_RECENT_EPISODES_TABLE);
        return result;
    } catch (error) {
        logger.error(`resetRecentEpisodesTableIPC error: ${error}`);
        return false;
    }
}
