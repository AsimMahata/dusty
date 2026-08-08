import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { ShowResult, ShowStatus, ShowType } from '../../pages/shows/types/types';

/*
IPC Commands:
dusty::api::show::scan_shows
dusty::api::show::sync_scan_shows
dusty::api::show::rename_show
dusty::api::show::update_show_status
dusty::api::show::update_ban_status
dusty::api::show::update_pin_status
dusty::api::show::update_show_id (calls update_show_provider)
dusty::api::show::reset_shows_table
dusty::api::show::get_show_cache
dusty::api::show::get_show_cache_key
dusty::api::show::upsert_show_cache
dusty::api::show::reset_show_cache
*/

const CMD_SCAN_SHOWS = "scan_shows";
const CMD_SYNC_SCAN_SHOWS = "sync_scan_shows";
const CMD_RENAME_SHOW = "rename_show";
const CMD_UPDATE_SHOW_STATUS = "update_show_status";
const CMD_UPDATE_BAN_STATUS = "update_ban_status";
const CMD_UPDATE_PIN_STATUS = "update_pin_status";
const CMD_UPDATE_SHOW_ID = "update_show_id";
const CMD_RESET_SHOWS_TABLE = "reset_shows_table";
const CMD_GET_SHOW_CACHE = "get_show_cache";
const CMD_UPSERT_SHOW_CACHE = "upsert_show_cache";
const CMD_RESET_SHOW_CACHE = "reset_show_cache";
const CMD_GET_SHOW_CACHE_KEY = "get_show_cache_key";

export async function scanShowsIPC(path?: string): Promise<ShowResult[]> {
    try {
        let result = await invoke<ShowResult[]>(CMD_SCAN_SHOWS, { path: path || null });
        return result;
    } catch (error) {
        logger.error(`scanShowsIPC error: ${error}`);
        return [];
    }
}

export async function syncScanShowsIPC(path?: string): Promise<ShowResult[]> {
    try {
        let result = await invoke<ShowResult[]>(CMD_SYNC_SCAN_SHOWS, { path: path || null });
        return result;
    } catch (error) {
        logger.error(`syncScanShowsIPC error: ${error}`);
        return [];
    }
}

export async function renameShowIPC(showId: string, newName: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_RENAME_SHOW, { showId, newName });
        return result;
    } catch (error) {
        logger.error(`renameShowIPC error: ${error}`);
        return false;
    }
}

export async function updateShowStatusIPC(showId: string, newStatus: ShowStatus): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_SHOW_STATUS, { showId, newStatus });
        return result;
    } catch (error) {
        logger.error(`updateShowStatusIPC error: ${error}`);
        return false;
    }
}

export async function updateBanStatusIPC(showId: string, newBanStatus: boolean): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_BAN_STATUS, { showId, newBanStatus });
        return result;
    } catch (error) {
        logger.error(`updateBanStatusIPC error: ${error}`);
        return false;
    }
}

export async function updateShowPinStatusIPC(showId: string, newPinStatus: boolean): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_PIN_STATUS, { showId, newPinStatus });
        return result;
    } catch (error) {
        logger.error(`updateShowPinStatusIPC error: ${error}`);
        return false;
    }
}

export async function updateShowProviderIPC(
    showId: string,
    provider: string,
    providerId: string,
    showType?: ShowType
): Promise<boolean> {
    try {
        await invoke(CMD_UPDATE_SHOW_ID, { id: showId, provider, providerId, showType });
        return true;
    } catch (error) {
        logger.error(`updateShowProviderIPC error: ${error}`);
        return false;
    }
}

export async function resetShowsTableIPC(): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_RESET_SHOWS_TABLE);
        return result;
    } catch (error) {
        logger.error(`resetShowsTableIPC error: ${error}`);
        return false;
    }
}

export async function getShowCacheIPC(showId: string, provider: string): Promise<string> {
    try {
        let result = await invoke<string>(CMD_GET_SHOW_CACHE, { showId, provider });
        return result;
    } catch (error) {
        logger.error(`getShowCacheIPC error: ${error}`);
        return '';
    }
}

export async function upsertShowCacheIPC(showId: string, provider: string, payload: string): Promise<boolean> {
    try {
        await invoke(CMD_UPSERT_SHOW_CACHE, { showId, provider, payload });
        return true;
    } catch (error) {
        logger.error(`upsertShowCacheIPC error: ${error}`);
        return false;
    }
}

export async function resetShowCacheIPC(): Promise<boolean> {
    try {
        await invoke(CMD_RESET_SHOW_CACHE);
        return true;
    } catch (error) {
        logger.error(`resetShowCacheIPC error: ${error}`);
        return false;
    }
}

export async function addShowsToDbIPC(shows: ShowResult[]): Promise<boolean> {
    try {
        let result = await invoke<boolean>("add_shows_to_db", { shows });
        return result;
    } catch (error) {
        logger.error(`addShowsToDbIPC error: ${error}`);
        return false;
    }
}

export async function getShowCacheKeyIPC(title: string): Promise<string> {
    try {
        return await invoke<string>(CMD_GET_SHOW_CACHE_KEY, { title });
    } catch (error) {
        logger.error(`getShowCacheKeyIPC error: ${error}`);
        return '';
    }
}
