import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { GitInfo } from '../../pages/projects/types/types';

/*
IPC Commands:
dusty::api::git::get_git_info
*/

const CMD_GET_GIT_INFO = "get_git_info";

export async function getGitInfoIPC(path: string): Promise<GitInfo | undefined> {
    try {
        let result = await invoke<GitInfo>(CMD_GET_GIT_INFO, { path });
        return result;
    } catch (error) {
        logger.error(`getGitInfoIPC error: ${error}`);
        return undefined;
    }
}
