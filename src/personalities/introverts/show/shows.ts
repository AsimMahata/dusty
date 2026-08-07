import {
    scanShowsIPC,
    syncScanShowsIPC,
    renameShowIPC,
    updateShowStatusIPC,
    updateBanStatusIPC,
    updateShowPinStatusIPC,
    updateShowIdIPC,
    resetShowsTableIPC
} from "../../ambiverts/show";
import type { ShowResult, ShowStatus, ShowType } from '../../../pages/shows/types/types';
import { getTvShowInfoFromTmdb, getMovieInfoFromTmdb, getAnimeInfoFromMal } from "./metadata";
import { logger } from "../../../utility/logger";

export async function fetchShows(path: string, sync: boolean = false): Promise<ShowResult[]> {
    if (sync) {
        return await syncScanShowsIPC(path);
    }
    return await scanShowsIPC(path);
}

export async function updateBanStatus(showId: string, isBanned: boolean): Promise<boolean> {
    return await updateBanStatusIPC(showId, isBanned);
}

export async function updateShowStatus(showId: string, status: ShowStatus): Promise<boolean> {
    return await updateShowStatusIPC(showId, status);
}

export async function updateShowTitle(showId: string, newTitle: string): Promise<boolean> {
    return await renameShowIPC(showId, newTitle);
}

export async function toggleShowPin(showId: string, currentPinStatus: boolean): Promise<boolean> {
    return await updateShowPinStatusIPC(showId, !currentPinStatus);
}

export async function updateShowIdForShow(showId: string, externalShowId: string, showType?: ShowType): Promise<boolean> {
    const success = await updateShowIdIPC(showId, externalShowId, showType);
    if (success) {
        // Pre-cache metadata in the background
        try {
            if (showType === 'anime') {
                const malIdNum = parseInt(externalShowId, 10);
                if (!isNaN(malIdNum)) {
                    await getAnimeInfoFromMal(malIdNum);
                }
            } else if (showType === 'movie') {
                await getMovieInfoFromTmdb(externalShowId);
            } else if (showType === 'tv_show') {
                await getTvShowInfoFromTmdb(externalShowId);
            }
        } catch (err) {
            logger.error(`Failed to pre-cache metadata during link for ${showId}: ${String(err)}`);
        }
    }
    return success;
}

export async function resetShowsTable(): Promise<boolean> {
    return await resetShowsTableIPC();
}
