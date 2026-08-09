import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import { logger } from "../../../utility/logger";
import { SHOW_PAGE_IS_GRID_LAYOUT } from "./id";

export function getDefaultIsGridLayout(): boolean {
    return false;
}

export async function getIsGridLayoutShowPage(): Promise<boolean> {
    try {
        let res = await getConfigValueIPC(SHOW_PAGE_IS_GRID_LAYOUT);
        if (!res) return getDefaultIsGridLayout();
        let isGridLayout: boolean = JSON.parse(res);
        return isGridLayout;
    } catch (e) {
        logger.error(`getIsGridLayoutShowPage error: ${e}`);
        return getDefaultIsGridLayout();
    }
}

export async function setIsGridLayoutShowPage(isGridLayout: boolean): Promise<void> {
    try {
        const data = JSON.stringify(isGridLayout);
        await addOrUpdateConfigValueIPC(SHOW_PAGE_IS_GRID_LAYOUT, data);
    } catch (e) {
        logger.error(`setIsGridLayoutShowPage error: ${e}`);
        throw e;
    }
}
