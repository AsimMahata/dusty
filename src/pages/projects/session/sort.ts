import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../../personalities/ambiverts/session";
import type { SortOption } from '../types/types';
import { logger } from "../../../utility/logger";
import { PROJECTS_PAGE_SORT_OPTION, PROJECTS_PAGE_SORT_ASCENDING } from "./id";

export function getDefaultSortOption(): SortOption {
    return 'recently_modified';
}

export function getDefaultSortAscending(): boolean {
    return true;
}

export async function getSortOptionProjectsPage(): Promise<SortOption> {
    try {
        let res = await getValueBySessionIdIPC(PROJECTS_PAGE_SORT_OPTION);
        let sortOption: SortOption = JSON.parse(res);
        return sortOption;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortOption();
        }
        logger.error(`getSortOptionProjectsPage error: ${e}`);
        return getDefaultSortOption();
    }
}

export async function setSortOptionProjectsPage(sortOption: SortOption): Promise<void> {
    try {
        const data = JSON.stringify(sortOption);
        await addOrUpdateBySessionIdIPC(PROJECTS_PAGE_SORT_OPTION, data);
    } catch (e) {
        logger.error(`setSortOptionProjectsPage error: ${e}`);
        throw e;
    }
}

export async function getSortAscendingProjectsPage(): Promise<boolean> {
    try {
        let res = await getValueBySessionIdIPC(PROJECTS_PAGE_SORT_ASCENDING);
        let sortAscending: boolean = JSON.parse(res);
        return sortAscending;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortAscending();
        }
        logger.error(`getSortAscendingProjectsPage error: ${e}`);
        return getDefaultSortAscending();
    }
}

export async function setSortAscendingProjectsPage(sortAscending: boolean): Promise<void> {
    try {
        const data = JSON.stringify(sortAscending);
        await addOrUpdateBySessionIdIPC(PROJECTS_PAGE_SORT_ASCENDING, data);
    } catch (e) {
        logger.error(`setSortAscendingProjectsPage error: ${e}`);
        throw e;
    }
}
