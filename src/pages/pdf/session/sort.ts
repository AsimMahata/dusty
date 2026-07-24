import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../../personalities/ambiverts/session";
import { logger } from "../../../utility/logger";
import type { MiscSortMode } from "../../misc/types/types";
import { PDF_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): MiscSortMode {
    return 'name';
}

export async function getSortModePdfPage(): Promise<MiscSortMode> {
    try {
        let res = await getValueBySessionIdIPC(PDF_PAGE_SORT_MODE);
        let sortMode: MiscSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        const errStr = String(e);
        if (errStr.includes("Session not found")) {
            return getDefaultSortMode();
        }
        logger.error(`getSortModePdfPage error: ${e}`);
        return getDefaultSortMode();
    }
}

export async function setSortModePdfPage(sortMode: MiscSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(PDF_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModePdfPage error: ${e}`);
        throw e;
    }
}
