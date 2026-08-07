import {
    scanShowsIPC,
    syncScanShowsIPC,
    renameShowIPC,
    updateShowStatusIPC,
    updateBanStatusIPC,
    updateShowPinStatusIPC,
    updateShowProviderIPC,
    resetShowsTableIPC,
    addShowsToDbIPC,
    upsertShowCacheIPC
} from "../../ambiverts/show";
import type { ShowResult, ShowStatus, ShowType } from '../../../pages/shows/types/types';
import { getProviderPayload, computeShowCacheKey } from "./metadata";
import { logger } from "../../../utility/logger";


export async function fetchShows(path: string, sync: boolean = false): Promise<ShowResult[]> {
    if (sync) {
        return await syncScanShowsIPC(path);
    }
    return await scanShowsIPC(path);
}

export async function addShowsToDb(shows: ShowResult[]): Promise<boolean> {
    const success = await addShowsToDbIPC(shows);
    if (success) {
        const showsWithProvider = shows.filter(s => s.provider && s.provider_id);
        if (showsWithProvider.length > 0) {
            (async () => {
                await Promise.allSettled(
                    showsWithProvider.map(async show => {
                        try {
                            if (show.raw_payload) {
                                const showId = await computeShowCacheKey(show.title);
                                await upsertShowCacheIPC(showId, show.provider!, show.raw_payload);
                            } else {
                                await getProviderPayload(show);
                            }
                        } catch (err) {
                            logger.error(`Failed to seed cache for ${show.title}: ${String(err)}`);
                        }
                    })
                );
            })();
        }
    }
    return success;
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

export async function updateShowIdForShow(
    showId: string,
    provider: string,
    externalShowId: string,
    showType?: ShowType
): Promise<boolean> {
    const success = await updateShowProviderIPC(showId, provider, externalShowId, showType);
    if (success) {
        try {
            const dummyShow: ShowResult = {
                id: showId,
                title: '',
                get_title: '',
                num_episodes: 0,
                episodes: [],
                dir: '',
                banned: false,
                pinned: false,
                status: 'default',
                provider,
                provider_id: externalShowId,
                show_type: showType || 'unknown'
            };
            await getProviderPayload(dummyShow);
        } catch (err) {
            logger.error(`Failed to pre-cache metadata during link for ${showId}: ${String(err)}`);
        }
    }
    return success;
}

export async function resetShowsTable(): Promise<boolean> {
    return await resetShowsTableIPC();
}
