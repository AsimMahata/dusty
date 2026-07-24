import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { ShowResult, ShowStatus } from '../../pages/shows/types/types';

/*
IPC Commands:
dusty::api::show::scan_shows
dusty::api::show::sync_scan_shows
dusty::api::show::rename_show
dusty::api::show::update_show_status
dusty::api::show::update_ban_status
dusty::api::show::update_pin_status
dusty::api::show::update_mal_id
dusty::api::show::update_imdb_id
dusty::api::show::reset_shows_table
*/

const CMD_SCAN_SHOWS = "scan_shows";
const CMD_SYNC_SCAN_SHOWS = "sync_scan_shows";
const CMD_RENAME_SHOW = "rename_show";
const CMD_UPDATE_SHOW_STATUS = "update_show_status";
const CMD_UPDATE_BAN_STATUS = "update_ban_status";
const CMD_UPDATE_PIN_STATUS = "update_pin_status";
const CMD_UPDATE_MAL_ID = "update_mal_id";
const CMD_UPDATE_IMDB_ID = "update_imdb_id";
const CMD_RESET_SHOWS_TABLE = "reset_shows_table";

export async function scanShowsIPC(path: string): Promise<ShowResult[]> {
    try {
        let result = await invoke<ShowResult[]>(CMD_SCAN_SHOWS, { path });
        return result;
    } catch (error) {
        logger.error(`scanShowsIPC error: ${error}`);
        return [];
    }
}

export async function syncScanShowsIPC(path: string): Promise<ShowResult[]> {
    try {
        let result = await invoke<ShowResult[]>(CMD_SYNC_SCAN_SHOWS, { path });
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

export async function updateMalIdIPC(showId: string, newMalId: number): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_MAL_ID, { showId, newMalId });
        return result;
    } catch (error) {
        logger.error(`updateMalIdIPC error: ${error}`);
        return false;
    }
}

export async function updateImdbIdIPC(showId: string, newImdbId: string): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_IMDB_ID, { showId, newImdbId });
        return result;
    } catch (error) {
        logger.error(`updateImdbIdIPC error: ${error}`);
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
