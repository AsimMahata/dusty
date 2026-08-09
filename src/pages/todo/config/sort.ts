import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import { logger } from "../../../utility/logger";
import type { SortDirection, SortMethod } from "../types/types";
import { TODO_PAGE_SORT_METHOD, TODO_PAGE_SORT_DIRECTION } from "./id";

export function getDefaultSortMethod(): SortMethod {
    return 'created';
}

export function getDefaultSortDirection(): SortDirection {
    return 'desc';
}

export async function getSortMethodTodoPage(): Promise<SortMethod> {
    try {
        let res = await getConfigValueIPC(TODO_PAGE_SORT_METHOD);
        if (!res) return getDefaultSortMethod();
        let sortMethod: SortMethod = JSON.parse(res);
        return sortMethod;
    } catch (e) {
        logger.error(`getSortMethodTodoPage error: ${e}`);
        return getDefaultSortMethod();
    }
}

export async function setSortMethodTodoPage(sortMethod: SortMethod): Promise<void> {
    try {
        const data = JSON.stringify(sortMethod);
        await addOrUpdateConfigValueIPC(TODO_PAGE_SORT_METHOD, data);
    } catch (e) {
        logger.error(`setSortMethodTodoPage error: ${e}`);
        throw e;
    }
}

export async function getSortDirectionTodoPage(): Promise<SortDirection> {
    try {
        let res = await getConfigValueIPC(TODO_PAGE_SORT_DIRECTION);
        if (!res) return getDefaultSortDirection();
        let sortDirection: SortDirection = JSON.parse(res);
        return sortDirection;
    } catch (e) {
        logger.error(`getSortDirectionTodoPage error: ${e}`);
        return getDefaultSortDirection();
    }
}

export async function setSortDirectionTodoPage(sortDirection: SortDirection): Promise<void> {
    try {
        const data = JSON.stringify(sortDirection);
        await addOrUpdateConfigValueIPC(TODO_PAGE_SORT_DIRECTION, data);
    } catch (e) {
        logger.error(`setSortDirectionTodoPage error: ${e}`);
        throw e;
    }
}
