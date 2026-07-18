import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";


/*
dusty::api::mal::get_anime_info_from_mal,
dusty::api::mal::update_anime_info_in_mal_cache,
dusty::api::mal::add_anime_info_to_mal_cache,
dusty::api::mal::reset_mal_cache,
*/

export const CMD_MAL_GET_INFO = 'get_anime_info_from_mal';
export const CMD_MAL_UPDATE_INFO_CACHE = 'update_anime_info_in_mal_cache';
export const CMD_MAL_ADD_INFO_CACHE = 'add_anime_info_to_mal_cache';
export const CMD_MAL_RESET_CACHE = 'reset_mal_cache';

export async function getAnimeInfoFromMalDB(id: number): Promise<string> {
    try{
        const result:string = await invoke(CMD_MAL_GET_INFO, { id: id });
        logger.info("MAL_INFO_FROM_DB_SUCESS",id);
        return result;
    }catch(err){
        logger.error("MAL_INFO_FROM_DB_FAILED",err);
        return "";
    }
}

export async function updateAnimeInfoInMalDB(id: number, data: string): Promise<string> {
    try{
        const result:string = await invoke(CMD_MAL_UPDATE_INFO_CACHE, { id: id, data: data });
        logger.info("MAL_INFO_UPDATE_DB_SUCESS",id);
        return result;
    }catch(err){
        logger.error("MAL_INFO_UPDATE_DB_FAILED",err);
        return "";
    }
}

export async function addAnimeInfoToMalDB(id: number, data: string): Promise<string> {
    try{
        const result:string = await invoke(CMD_MAL_ADD_INFO_CACHE, { id: id, data: data });
        logger.info("MAL_INFO_ADD_DB_SUCESS",id);
        return result;
    }catch(err){
        logger.error("MAL_INFO_ADD_DB_FAILED",err);
        return "";
    }
}

export async function resetMalCacheDB(): Promise<string> {
    return invoke(CMD_MAL_RESET_CACHE);
}


