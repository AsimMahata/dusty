import toast from 'react-hot-toast';
import type { GitInfo } from '../../../types/projects';
import type { Project } from '../../../types/projects';
import { logger } from '../../../utility/logger';
import { scanProjectTagsOnBackend } from '../../ambiverts/projects';
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

export const scanProjectTags = async (project: Project): Promise<string[]> => {
    try {
        return await scanProjectTagsOnBackend(project);
    } catch (err) {
        logger.error(`Failed to scan tags for project: ${project.title}`, err);
        return [];
    }
};
