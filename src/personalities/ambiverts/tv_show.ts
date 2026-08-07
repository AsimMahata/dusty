import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { ShowData } from '../../pages/shows/types/types';

/*
dusty::api::tv_show::get_all_tv_shows_from_db,
dusty::api::tv_show::add_seasonal_tv_show_to_db,
dusty::api::tv_show::get_tv_show_info_from_tmdb,
dusty::api::tv_show::update_tv_show_info_in_tmdb_cache,
dusty::api::tv_show::add_tv_show_info_to_tmdb_cache,
dusty::api::tv_show::reset_tmdb_cache,
*/

const CMD_GET_ALL_TV_SHOWS = 'get_all_tv_shows_from_db';
const CMD_ADD_SEASONAL_TV_SHOW = 'add_seasonal_tv_show_to_db';
const CMD_GET_TV_SHOW_INFO = 'get_tv_show_info_from_tmdb';
const CMD_UPDATE_TV_SHOW_INFO_CACHE = 'update_tv_show_info_in_tmdb_cache';
const CMD_ADD_TV_SHOW_INFO_CACHE = 'add_tv_show_info_to_tmdb_cache';
const CMD_RESET_TMDB_CACHE = 'reset_tmdb_cache';

export async function getAllTvShowsFromIPC(): Promise<ShowData[]> {
    try {
        let result = await invoke<ShowData[]>(CMD_GET_ALL_TV_SHOWS);
        return result;
    } catch (error) {
        logger.error(`getAllTvShowsFromIPC error: ${error}`);
        return [];
    }
}

export async function addTvShowIPC(data: ShowData[]): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_ADD_SEASONAL_TV_SHOW, { data: data });
        logger.info("TV_SHOW_ADD_DB_SUCCESS", data.length);
        return result;
    } catch (error) {
        logger.error(`addTvShowIPC error: ${error}`);
        return false;
    }
}

export async function getTvShowInfoFromTmdbIPC(id: string): Promise<string> {
    try {
        let result = await invoke<string>(CMD_GET_TV_SHOW_INFO, { id: id });
        return result;
    } catch (error) {
        logger.error(`getTvShowInfoFromTmdbIPC error: ${error}`);
        return '';
    }
}

export async function updateTvShowInfoInTmdbIPC(id: string, data: string): Promise<boolean> {
    try {
        await invoke(CMD_UPDATE_TV_SHOW_INFO_CACHE, { id: id, data: data });
        return true;
    } catch (error) {
        logger.error(`updateTvShowInfoInTmdbIPC error: ${error}`);
        return false;
    }
}

export async function addTvShowInfoToTmdbIPC(id: string, data: string): Promise<boolean> {
    try {
        await invoke(CMD_ADD_TV_SHOW_INFO_CACHE, { id: id, data: data });
        return true;
    } catch (error) {
        logger.error(`addTvShowInfoToTmdbIPC error: ${error}`);
        return false;
    }
}

export async function resetTmdbCacheIPC(): Promise<boolean> {
    try {
        await invoke(CMD_RESET_TMDB_CACHE);
        return true;
    } catch (error) {
        logger.error(`resetTmdbCacheIPC error: ${error}`);
        return false;
    }
}
