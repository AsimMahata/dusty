import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../../personalities/ambiverts/session";
import type { MiscSortMode } from "../../misc/types/types";
import { logger } from "../../../utility/logger";
import { ZIP_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): MiscSortMode {
    return 'name';
}

export async function getSortModeZipPage(): Promise<MiscSortMode> {
    try {
        let res = await getValueBySessionIdIPC(ZIP_PAGE_SORT_MODE);
        let sortMode: MiscSortMode = JSON.parse(res);
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

export async function setSortModeZipPage(sortMode: MiscSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(ZIP_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModeZipPage error: ${e}`);
        throw e;
    }
}
