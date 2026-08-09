import { addOrUpdateConfigValueIPC, getConfigValueIPC } from "../../../personalities/ambiverts/config";
import { logger } from "../../../utility/logger";
import { TABS } from "../constants/constants";
import type { ShowTab } from "../types/types";
import { ACTIVE_SHOW_PAGE_TAB } from "./id";

export function getDefaultTab(): ShowTab {
    return TABS[0];
}

export async function getActiveTabShowPage(): Promise<ShowTab> {
    try {
        let res = await getConfigValueIPC(ACTIVE_SHOW_PAGE_TAB);
        if (!res) return getDefaultTab();
        let tab: ShowTab = JSON.parse(res);
        return tab;
    } catch (e) {
        logger.error(`getActiveTabShowPage error: ${e}`);
        return getDefaultTab();
    }
}

export async function setActiveTabShowPage(tab: ShowTab): Promise<void> {
    try {
        const activeTab = JSON.stringify(tab);
        await addOrUpdateConfigValueIPC(ACTIVE_SHOW_PAGE_TAB, activeTab);
    } catch (e) {
        logger.error(`setActiveTabShowPage error: ${e}`);
        throw e;
    }
}
