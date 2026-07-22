import { TABS } from "../../pages/shows/constants/constants";
import { addOrUpdateBySessionIdIPC, getValueBySessionIdIPC } from "../../personalities/ambiverts/session";
import type { ShowTab } from "../../types/shows";
import { logger } from "../../utility/logger";
import { ACTIVE_SHOW_PAGE_TAB } from "./id";

export function getDefaultTab():ShowTab{
    return TABS[0];
}

export async function getActiveTabShowPage(): Promise<ShowTab> {
    try{
    let res = await getValueBySessionIdIPC(ACTIVE_SHOW_PAGE_TAB);
    let tab:ShowTab = JSON.parse(res);
    return tab;
    }catch(e){
        logger.error(`getActiveTabShowPage error: ${e}`);
        throw e;
    }
}

export async function setActiveTabShowPage(tab:ShowTab):Promise<void>{
    try{
    const activeTab = JSON.stringify(tab);
    await addOrUpdateBySessionIdIPC(ACTIVE_SHOW_PAGE_TAB,activeTab);
    }catch(e){
        logger.error(`setActiveTabShowPage error: ${e}`);
        throw e;
    }
}