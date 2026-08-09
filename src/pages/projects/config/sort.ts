import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
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
        let res = await getConfigValueIPC(PROJECTS_PAGE_SORT_OPTION);
        if (!res) return getDefaultSortOption();
        let sortOption: SortOption = JSON.parse(res);
        return sortOption;
    } catch (e) {
        logger.error(`getSortOptionProjectsPage error: ${e}`);
        return getDefaultSortOption();
    }
}

export async function setSortOptionProjectsPage(sortOption: SortOption): Promise<void> {
    try {
        const data = JSON.stringify(sortOption);
        await addOrUpdateConfigValueIPC(PROJECTS_PAGE_SORT_OPTION, data);
    } catch (e) {
        logger.error(`setSortOptionProjectsPage error: ${e}`);
        throw e;
    }
}

export async function getSortAscendingProjectsPage(): Promise<boolean> {
    try {
        let res = await getConfigValueIPC(PROJECTS_PAGE_SORT_ASCENDING);
        if (!res) return getDefaultSortAscending();
        let sortAscending: boolean = JSON.parse(res);
        return sortAscending;
    } catch (e) {
        logger.error(`getSortAscendingProjectsPage error: ${e}`);
        return getDefaultSortAscending();
    }
}

export async function setSortAscendingProjectsPage(sortAscending: boolean): Promise<void> {
    try {
        const data = JSON.stringify(sortAscending);
        await addOrUpdateConfigValueIPC(PROJECTS_PAGE_SORT_ASCENDING, data);
    } catch (e) {
        logger.error(`setSortAscendingProjectsPage error: ${e}`);
        throw e;
    }
}
