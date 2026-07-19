import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { ShowData } from "../../introverts/show/imdb";

export const CMD_ADD_SEASONAL_SHOW_DB = 'add_seasonal_show_db';

export async function addSeasonalShowDB(data: ShowData[]): Promise<boolean> {
    try {
        // Since we are not touching backend, we just return true or log it for now
        // If the backend gets implemented, it will uncomment this:
        // await invoke(CMD_ADD_SEASONAL_SHOW_DB, { data: data });
        logger.info("SEASONAL_SHOW_ADD_DB_SUCCESS (frontend only)", data.length);
        return true;
    } catch (err) {
        logger.error("SEASONAL_SHOW_ADD_DB_FAILED", err);
        return false;
    }
}
