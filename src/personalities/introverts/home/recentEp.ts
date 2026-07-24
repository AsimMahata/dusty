
import { getRecentViewedEpisodesIPC, putEpisodeInRecentIPC } from "../../ambiverts/recent";
import { logger } from "../../../utility/logger";
import type { VideoItem } from "../../../types/core";
import type { FileInfo } from "../../../types/core";
import type { ShowResult } from '../../../pages/shows/types/types';
import type { RecentEpisode } from "../../../pages/home/types/types";

export async function getRecentViewedEpisodes(): Promise<RecentEpisode[]> {
    try {
        const recentVideos: VideoItem[] = await getRecentViewedEpisodesIPC();
        return recentVideos.map(video => ({
            show: video.show,
            episode: {
                id: video.episode.id,
                title: video.episode.name,
                path: video.episode.path,
                rawSize: video.episode.size,
                episode_status: "watched" // or another default
            }
        }));
    } catch (error) {
        logger.error("Error fetching recent viewed episodes from db:", error);
        return [];
    }
}

export async function putEpisodeInRecent(show: ShowResult, episode: FileInfo) {
    try {
        await putEpisodeInRecentIPC({
            show: show,
            episode: episode
        });
    } catch (error) {
        logger.error("Error putting episode in recent", error);
    }
}
