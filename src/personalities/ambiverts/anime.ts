import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { AnimeData } from "../../types/shows";

export const CMD_ADD_SEASONAL_ANIME = 'add_seasonal_anime_to_db';
export const CMD_GET_ALL_ANIME = 'get_all_anime_from_db';

export async function getAllAnimeFromDB(): Promise<AnimeData[]> {
    try {
        let anime_list: AnimeData[] = await invoke(CMD_GET_ALL_ANIME);
        return anime_list;
    } catch (error) {
        logger.error(`getAllAnimeFromDB error: ${error}`);
        return [];
    }
}
export async function addSeasonalAnimeDB(data: AnimeData[]): Promise<boolean> {
    try {
        logger.info('Successfully fetched seasonal anime from API.');
        let success: boolean = await invoke(CMD_ADD_SEASONAL_ANIME, { data: data });
        logger.info('Seasonal anime added to DB.', success);
        if (success) {
            logger.info('Successfully added seasonal anime to DB.');
            return true;
        } else {
            logger.error('Failed to add seasonal anime to DB.');
            return false;
        }
    } catch (error) {
        logger.error(`addSeasonalAnimeDB error: ${error}`);
        return false;
    }
}

export async function getSeasonalAnimeFromDB(): Promise<AnimeData[]> {
    try {
        let anime_list: AnimeData[] = await invoke('get_seasonal_anime_with_info');
        return anime_list;
    } catch (error) {
        logger.error(`getSeasonalAnimeFromDB error: ${error}`);
        return [];
    }
}
