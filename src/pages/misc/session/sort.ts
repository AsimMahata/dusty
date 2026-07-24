import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../../personalities/ambiverts/session";
import type { MiscSortMode } from '../types/types';
import { logger } from "../../../utility/logger";
import { MISC_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): MiscSortMode {
    return 'size';
}

export async function getSortModeMiscPage(): Promise<MiscSortMode> {
    try {
        let res = await getValueBySessionIdIPC(MISC_PAGE_SORT_MODE);
        let sortMode: MiscSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortMode();
        }
        logger.error(`getSortModeMiscPage error: ${e}`);
        return getDefaultSortMode();
    }
}

export async function setSortModeMiscPage(sortMode: MiscSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(MISC_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModeMiscPage error: ${e}`);
        throw e;
    }
}
