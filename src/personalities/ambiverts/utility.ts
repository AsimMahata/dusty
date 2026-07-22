import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";

/*
IPC Commands:
dusty::api::utility::get_coupling_value_between_query_and_result_title
*/

const CMD_GET_COUPLING_VALUE = "get_coupling_value_between_query_and_result_title";

export async function getCouplingValueBetweenQueryAndResultTitleIPC(s1: string, s2: string): Promise<number | undefined> {
    try {
        let result = await invoke<number>(CMD_GET_COUPLING_VALUE, { s1, s2 });
        return result;
    } catch (error) {
        logger.error(`getCouplingValueBetweenQueryAndResultTitleIPC error: ${error}`);
        return undefined;
    }
}
