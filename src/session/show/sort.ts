import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../personalities/ambiverts/session";
import type { ShowSortMethod } from "../../types/shows";
import { logger } from "../../utility/logger";
import { SHOW_PAGE_SORT_METHOD, SHOW_PAGE_SORT_ASCENDING } from "./id";

export function getDefaultSortMethod(): ShowSortMethod {
    return 'last_watched';
}

export function getDefaultSortAscending(): boolean {
    return false;
}

export async function getSortMethodShowPage(): Promise<ShowSortMethod> {
    try {
        let res = await getValueBySessionIdIPC(SHOW_PAGE_SORT_METHOD);
        let sortMethod: ShowSortMethod = JSON.parse(res);
        return sortMethod;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortMethod();
        }
        logger.error(`getSortMethodShowPage error: ${e}`);
        return getDefaultSortMethod();
    }
}

export async function setSortMethodShowPage(sortMethod: ShowSortMethod): Promise<void> {
    try {
        const data = JSON.stringify(sortMethod);
        await addOrUpdateBySessionIdIPC(SHOW_PAGE_SORT_METHOD, data);
    } catch (e) {
        logger.error(`setSortMethodShowPage error: ${e}`);
        throw e;
    }
}

export async function getSortAscendingShowPage(): Promise<boolean> {
    try {
        let res = await getValueBySessionIdIPC(SHOW_PAGE_SORT_ASCENDING);
        let sortAscending: boolean = JSON.parse(res);
        return sortAscending;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortAscending();
        }
        logger.error(`getSortAscendingShowPage error: ${e}`);
        return getDefaultSortAscending();
    }
}

export async function setSortAscendingShowPage(sortAscending: boolean): Promise<void> {
    try {
        const data = JSON.stringify(sortAscending);
        await addOrUpdateBySessionIdIPC(SHOW_PAGE_SORT_ASCENDING, data);
    } catch (e) {
        logger.error(`setSortAscendingShowPage error: ${e}`);
        throw e;
    }
}
