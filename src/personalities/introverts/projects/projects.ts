import toast from 'react-hot-toast';
import type { GitInfo } from '../../../types/projects';
import type { Project } from '../../../types/projects';
import { logger } from '../../../utility/logger';
import { scanProjectTagsIPC, getProjectsIPC, updateProjectPinStatusIPC, updateProjectStatusIPC, updateProjectTagsIPC } from '../../ambiverts/projects';
import { invoke } from '@tauri-apps/api/core';
import type { ProjectStatus } from '../../../types/projects';

export async function getProjects(sync: boolean = false): Promise<Project[]> {
    return await getProjectsIPC(sync);
}

export async function updateProjectPinStatus(id: string, pinned: boolean): Promise<boolean> {
    return await updateProjectPinStatusIPC(id, pinned);
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<boolean> {
    return await updateProjectStatusIPC(id, status);
}

export async function updateProjectTags(id: string, tags: string[]): Promise<boolean> {
    return await updateProjectTagsIPC(id, tags);
}

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
        return await scanProjectTagsIPC(project);
    } catch (err) {
        logger.error(`Failed to scan tags for project: ${project.title}`, err);
        return [];
    }
};
