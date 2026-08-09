import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import { logger } from "../../../utility/logger";
import type { MiscSortMode } from "../../misc/types/types";
import { PDF_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): MiscSortMode {
    return 'name';
}

export async function getSortModePdfPage(): Promise<MiscSortMode> {
    try {
        let res = await getConfigValueIPC(PDF_PAGE_SORT_MODE);
        if (!res) return getDefaultSortMode();
        let sortMode: MiscSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        logger.error(`getSortModePdfPage error: ${e}`);
        return getDefaultSortMode();
    }
}

export async function setSortModePdfPage(sortMode: MiscSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateConfigValueIPC(PDF_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModePdfPage error: ${e}`);
        throw e;
    }
}
