import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import type { MiscSortMode } from "../../misc/types/types";
import { logger } from "../../../utility/logger";
import { ZIP_PAGE_SORT_MODE } from "./id";

export function getDefaultSortMode(): MiscSortMode {
    return 'name';
}

export async function getSortModeZipPage(): Promise<MiscSortMode> {
    try {
        let res = await getConfigValueIPC(ZIP_PAGE_SORT_MODE);
        if (!res) return getDefaultSortMode();
        let sortMode: MiscSortMode = JSON.parse(res);
        return sortMode;
    } catch (e) {
        logger.error(`getSortModeZipPage error: ${e}`);
        return getDefaultSortMode();
    }
}

export async function setSortModeZipPage(sortMode: MiscSortMode): Promise<void> {
    try {
        const data = JSON.stringify(sortMode);
        await addOrUpdateConfigValueIPC(ZIP_PAGE_SORT_MODE, data);
    } catch (e) {
        logger.error(`setSortModeZipPage error: ${e}`);
        throw e;
    }
}
