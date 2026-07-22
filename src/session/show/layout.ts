import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../personalities/ambiverts/session";
import { logger } from "../../utility/logger";
import { SHOW_PAGE_IS_GRID_LAYOUT } from "./id";

export function getDefaultIsGridLayout(): boolean {
    return false;
}

export async function getIsGridLayoutShowPage(): Promise<boolean> {
    try {
        let res = await getValueBySessionIdIPC(SHOW_PAGE_IS_GRID_LAYOUT);
        let isGridLayout: boolean = JSON.parse(res);
        return isGridLayout;
    } catch (e) {
        logger.error(`getIsGridLayoutShowPage error: ${e}`);
        throw e;
    }
}

export async function setIsGridLayoutShowPage(isGridLayout: boolean): Promise<void> {
    try {
        const data = JSON.stringify(isGridLayout);
        await addOrUpdateBySessionIdIPC(SHOW_PAGE_IS_GRID_LAYOUT, data);
    } catch (e) {
        logger.error(`setIsGridLayoutShowPage error: ${e}`);
        throw e;
    }
}
