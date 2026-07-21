import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { VideoItem } from "../../types/media";
export const CMD_GET_RECENT_VIEW_VIDEOS = "get_recent_episodes";
export const CMD_PUT_EPISODE_IN_RECENT = "add_recent_episode";
export const CMD_RESET_RECENT_EPISODES_TABLE = "reset_recent_episodes_table";

export async function getRecentViewedEpisodesDB(): Promise<VideoItem[]> {
    try {
        return await invoke(CMD_GET_RECENT_VIEW_VIDEOS);
    } catch (err) {
        logger.error("Failed to get recent view videos", err);
        return [];
    }
}

export async function putEpisodeInRecentDB(video: VideoItem): Promise<boolean> {
    try {
        await invoke(CMD_PUT_EPISODE_IN_RECENT, {
            video: video
        });
        logger.info("Added episode to recent", video);
        return true;
    } catch (err) {
        logger.error("Failed to put episode in recent", err);
        return false;
    }
}

export async function resetRecentEpisodesTableDB(): Promise<boolean> {
    try {
        await invoke(CMD_RESET_RECENT_EPISODES_TABLE);
        return true;
    } catch (err) {
        logger.error("Failed to reset recent episodes table", err);
        return false;
    }
}
