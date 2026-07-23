import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../personalities/ambiverts/session";
import type { PdfSortMode } from "../../types/pdf";
import { logger } from "../../utility/logger";
import { PDF_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): PdfSortMode {
    return 'name';
}

export async function getSortModePdfPage(): Promise<PdfSortMode> {
    try {
        let res = await getValueBySessionIdIPC(PDF_PAGE_SORT_MODE);
        let sortMode: PdfSortMode = JSON.parse(res);
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

export async function setSortModePdfPage(sortMode: PdfSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateBySessionIdIPC(PDF_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModePdfPage error: ${e}`);
        throw e;
    }
}
