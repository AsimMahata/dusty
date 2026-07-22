import { logger } from "../../utility/logger";
import type { ShowData } from "../../types/shows";

/*
// Backend command not yet implemented
*/


export async function addSeasonalShowIPC(data: ShowData[]): Promise<boolean> {
    try {
        // Since we are not touching backend, we just return true or log it for now
        // If the backend gets implemented, it will uncomment this:
        // let result = await invoke<boolean>(CMD_ADD_SEASONAL_SHOW_DB, { data: data });
        // return result;
        logger.info("SEASONAL_SHOW_ADD_DB_SUCCESS (frontend only)", data.length);
        return true;
    } catch (error) {
        logger.error(`addSeasonalShowIPC error: ${error}`);
        return false;
    }
}
