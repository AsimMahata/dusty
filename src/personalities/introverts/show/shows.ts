import {
    scanShowsIPC,
    syncScanShowsIPC,
    renameShowIPC,
    updateShowStatusIPC,
    updateBanStatusIPC,
    updateShowPinStatusIPC,
    updateMalIdIPC,
    updateImdbIdIPC,
    resetShowsTableIPC
} from "../../ambiverts/show";
import type { ShowResult, ShowStatus } from '../../../pages/shows/types/types';

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

export async function updateMalIdForShow(showId: string, malId: number): Promise<boolean> {
    return await updateMalIdIPC(showId, malId);
}

export async function updateImdbIdForShow(showId: string, imdbId: string): Promise<boolean> {
    return await updateImdbIdIPC(showId, imdbId);
}

export async function resetShowsTable(): Promise<boolean> {
    return await resetShowsTableIPC();
}
