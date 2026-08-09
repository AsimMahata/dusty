import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import { logger } from "../../../utility/logger";
import type { ShowSortMethod } from "../types/types";
import { SHOW_PAGE_SORT_METHOD, SHOW_PAGE_SORT_ASCENDING } from "./id";

export function getDefaultSortMethod(): ShowSortMethod {
    return 'last_watched';
}

export function getDefaultSortAscending(): boolean {
    return false;
}

export async function getSortMethodShowPage(): Promise<ShowSortMethod> {
    try {
        let res = await getConfigValueIPC(SHOW_PAGE_SORT_METHOD);
        if (!res) return getDefaultSortMethod();
        let sortMethod: ShowSortMethod = JSON.parse(res);
        return sortMethod;
    } catch (e) {
        logger.error(`getSortMethodShowPage error: ${e}`);
        return getDefaultSortMethod();
    }
}

export async function setSortMethodShowPage(sortMethod: ShowSortMethod): Promise<void> {
    try {
        const data = JSON.stringify(sortMethod);
        await addOrUpdateConfigValueIPC(SHOW_PAGE_SORT_METHOD, data);
    } catch (e) {
        logger.error(`setSortMethodShowPage error: ${e}`);
        throw e;
    }
}

export async function getSortAscendingShowPage(): Promise<boolean> {
    try {
        let res = await getConfigValueIPC(SHOW_PAGE_SORT_ASCENDING);
        if (!res) return getDefaultSortAscending();
        let sortAscending: boolean = JSON.parse(res);
        return sortAscending;
    } catch (e) {
        logger.error(`getSortAscendingShowPage error: ${e}`);
        return getDefaultSortAscending();
    }
}

export async function setSortAscendingShowPage(sortAscending: boolean): Promise<void> {
    try {
        const data = JSON.stringify(sortAscending);
        await addOrUpdateConfigValueIPC(SHOW_PAGE_SORT_ASCENDING, data);
    } catch (e) {
        logger.error(`setSortAscendingShowPage error: ${e}`);
        throw e;
    }
}
