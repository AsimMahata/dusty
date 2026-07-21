
import { getRecentViewedEpisodesDB, putEpisodeInRecentDB } from "../../ambiverts/recent";
import { logger } from "../../../utility/logger";
import type { VideoItem } from "../../../types/media";
import type { RecentEpisode } from "../../../types/home";
import type { FileInfo } from "../../../types/media";
import type { ShowResult } from "../../../types/shows";

export async function getRecentViewedEpisodes(): Promise<RecentEpisode[]> {
    try {
        const recentVideos: VideoItem[] = await getRecentViewedEpisodesDB();
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
        await putEpisodeInRecentDB({
            show: show,
            episode: episode
        });
    } catch (error) {
        logger.error("Error putting episode in recent", error);
    }
}
