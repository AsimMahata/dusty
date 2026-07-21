import toast from 'react-hot-toast';
import type { GitInfo } from '../../../types/projects';
import { logger } from '../../../utility/logger';
import { invoke } from '@tauri-apps/api/core';

export const openProjectGithub = async (gitInfo: GitInfo | undefined): Promise<void> => {
    if (!gitInfo?.git_remote_url) {
        toast("GitHub repository not found", { icon: "❌" });
        logger.warn("GitHub repository not found");
        return;
    }

    logger.info(`Opening GitHub repository: ${gitInfo.git_remote_url}`);
    await invoke("open_url", {
        url: gitInfo.git_remote_url,
    });
}
