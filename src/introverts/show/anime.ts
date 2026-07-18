import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import { getSeasonalAnimeAPI } from "../../extroverts/show/anime";
import { addSeasonalAnimeDB, getSeasonalAnimeFromDB } from "../../ambiverts/show/anime";


export interface AnimeData {
    title: string;
    mal_id: number;
    num_episodes: number | null;
    season: number | null;
    seasonal: boolean;
}

export async function addSeasonalAnime(): Promise<boolean> {
    try {
        let anime_list: AnimeData[] = await getSeasonalAnimeFromDB();
        if (anime_list && anime_list.length > 0) {
            logger.info('Seasonal anime already available in backend.');
            return true;
        } 
        logger.info('Seasonal anime not available, fetching from API...');
        let data = await getSeasonalAnimeAPI();
        logger.info('Seasonal anime fetched from API.', data);
        if (data && data.length > 0) {
          return await addSeasonalAnimeDB(data);
        } 
        logger.error('Failed to fetch seasonal anime from API or list is empty.');
        return false;
    } catch (e) {
        logger.error(`addSeasonalAnime error: ${e}`);
        return false;
    }
}

