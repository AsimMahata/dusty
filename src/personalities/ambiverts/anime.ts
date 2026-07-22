import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { AnimeData } from "../../types/shows";

/*
dusty::api::anime::get_seasonal_anime_with_info,
dusty::api::anime::get_all_anime_from_db,
dusty::api::anime::add_seasonal_anime_to_db,
*/

const CMD_ADD_SEASONAL_ANIME = 'add_seasonal_anime_to_db';
const CMD_GET_ALL_ANIME = 'get_all_anime_from_db';
const CMD_GET_SEASONAL_ANIME = 'get_seasonal_anime_with_info';


export async function getAllAnimeFromIPC(): Promise<AnimeData[]> {
    try {
        let anime_list = await invoke<AnimeData[]>(CMD_GET_ALL_ANIME);
        return anime_list;
    } catch (error) {
        logger.error(`getAllAnimeFromIPC error: ${error}`);
        return [];
    }
}
export async function addSeasonalAnimeIPC(data: AnimeData[]): Promise<boolean> {
    try {
        logger.info('Successfully fetched seasonal anime from API.');
        let success = await invoke<boolean>(CMD_ADD_SEASONAL_ANIME, { data: data });
        logger.info('Seasonal anime added to DB.', success);
        if (success) {
            logger.info('Successfully added seasonal anime to DB.');
            return true;
        } else {
            logger.error('Failed to add seasonal anime to DB.');
            return false;
        }
    } catch (error) {
        logger.error(`addSeasonalAnimeIPC error: ${error}`);
        return false;
    }
}

export async function getSeasonalAnimeFromIPC(): Promise<AnimeData[]> {
    try {
        let anime_list = await invoke<AnimeData[]>(CMD_GET_SEASONAL_ANIME);
        return anime_list;
    } catch (error) {
        logger.error(`getSeasonalAnimeFromIPC error: ${error}`);
        return [];
    }
}
