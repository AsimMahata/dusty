import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
dusty::api::mal::get_anime_info_from_mal,
dusty::api::mal::update_anime_info_in_mal_cache,
dusty::api::mal::add_anime_info_to_mal_cache,
dusty::api::mal::reset_mal_cache,
*/

const CMD_MAL_GET_INFO = 'get_anime_info_from_mal';
const CMD_MAL_UPDATE_INFO_CACHE = 'update_anime_info_in_mal_cache';
const CMD_MAL_ADD_INFO_CACHE = 'add_anime_info_to_mal_cache';
const CMD_MAL_RESET_CACHE = 'reset_mal_cache';

export async function getAnimeInfoFromMalIPC(id: number): Promise<string> {
    try {
        let result = await invoke<string>(CMD_MAL_GET_INFO, { id: id });
        return result;
    } catch (error) {
        logger.error(`getAnimeInfoFromMalIPC error: ${error}`);
        return '';
    }
}

export async function updateAnimeInfoInMalIPC(id: number, data: string): Promise<string> {
    try {
        let result = await invoke<string>(CMD_MAL_UPDATE_INFO_CACHE, { id: id, data: data });
        return result;
    } catch (error) {
        logger.error(`updateAnimeInfoInMalIPC error: ${error}`);
        return '';
    }
}

export async function addAnimeInfoToMalIPC(id: number, data: string): Promise<string> {
    try {
        let result = await invoke<string>(CMD_MAL_ADD_INFO_CACHE, { id: id, data: data });
        return result;
    } catch (error) {
        logger.error(`addAnimeInfoToMalIPC error: ${error}`);
        return '';
    }
}

export async function resetMalCacheIPC(): Promise<string> {
    try {
        let result = await invoke<string>(CMD_MAL_RESET_CACHE);
        return result;
    } catch (error) {
        logger.error(`resetMalCacheIPC error: ${error}`);
        return '';
    }
}
