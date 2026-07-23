import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../personalities/ambiverts/session";
import type { ZipSortMode } from "../../types/zip";
import { logger } from "../../utility/logger";
import { ZIP_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): ZipSortMode {
    return 'name';
}

export async function getSortModeZipPage(): Promise<ZipSortMode> {
    try {
        let res = await getValueBySessionIdIPC(ZIP_PAGE_SORT_MODE);
        let sortMode: ZipSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortMode();
        }
        logger.error(`getSortModeZipPage error: ${e}`);
        return getDefaultSortMode();
    }
}

export async function setSortModeZipPage(sortMode: ZipSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(ZIP_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModeZipPage error: ${e}`);
        throw e;
    }
}
