import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../../personalities/ambiverts/session";
import { logger } from "../../../utility/logger";
import type { MediaSortMethod, MediaSortMode } from "../types/types";
import { MEDIA_SOURCES_PAGE_SORT_METHOD, MEDIA_SOURCES_PAGE_SORT_ASCENDING, MEDIA_LIST_PAGE_SORT_MODE } from "./id";

export function getDefaultSourcesSortMethod(): MediaSortMethod {
    return 'title';
}

export function getDefaultSourcesSortAscending(): boolean {
    return true;
}

export function getDefaultListSortMode(): MediaSortMode {
    return 'name';
}

export async function getSortMethodMediaSourcesPage(): Promise<MediaSortMethod> {
    try {
        let res = await getValueBySessionIdIPC(MEDIA_SOURCES_PAGE_SORT_METHOD);
        let sortMethod: MediaSortMethod = JSON.parse(res);
        return sortMethod;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSourcesSortMethod();
        }
        logger.error(`getSortMethodMediaSourcesPage error: ${e}`);
        return getDefaultSourcesSortMethod();
    }
}

export async function setSortMethodMediaSourcesPage(sortMethod: MediaSortMethod): Promise<void> {
    try {
        const data = JSON.stringify(sortMethod);
        await addOrUpdateBySessionIdIPC(MEDIA_SOURCES_PAGE_SORT_METHOD, data);
    } catch (e) {
        logger.error(`setSortMethodMediaSourcesPage error: ${e}`);
        throw e;
    }
}

export async function getSortAscendingMediaSourcesPage(): Promise<boolean> {
    try {
        let res = await getValueBySessionIdIPC(MEDIA_SOURCES_PAGE_SORT_ASCENDING);
        let sortAscending: boolean = JSON.parse(res);
        return sortAscending;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSourcesSortAscending();
        }
        logger.error(`getSortAscendingMediaSourcesPage error: ${e}`);
        return getDefaultSourcesSortAscending();
    }
}

export async function setSortAscendingMediaSourcesPage(sortAscending: boolean): Promise<void> {
    try {
        const data = JSON.stringify(sortAscending);
        await addOrUpdateBySessionIdIPC(MEDIA_SOURCES_PAGE_SORT_ASCENDING, data);
    } catch (e) {
        logger.error(`setSortAscendingMediaSourcesPage error: ${e}`);
        throw e;
    }
}

export async function getSortModeMediaListPage(): Promise<MediaSortMode> {
    try {
        let res = await getValueBySessionIdIPC(MEDIA_LIST_PAGE_SORT_MODE);
        let sortMode: MediaSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultListSortMode();
        }
        logger.error(`getSortModeMediaListPage error: ${e}`);
        return getDefaultListSortMode();
    }
}

export async function setSortModeMediaListPage(sortMode: MediaSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(MEDIA_LIST_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModeMediaListPage error: ${e}`);
        throw e;
    }
}
