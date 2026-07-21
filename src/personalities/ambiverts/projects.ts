import { invoke } from '@tauri-apps/api/core';
import { logger } from '../../utility/logger';
import { 
    CMD_SCAN_PROJECTS, 
    CMD_SYNC_SCAN_PROJECTS, 
    CMD_UPDATE_PROJECT_PIN_STATUS, 
    CMD_UPDATE_PROJECT_STATUS,
    CMD_UPDATE_PROJECT_TAGS,
    CMD_SCAN_PROJECT_TAGS
} from '../../constants/commands';
import type { Project, ProjectStatus } from "../../types/projects";

export const getProjectsFromBackend = async (sync: boolean = false): Promise<Project[]> => {
    try {
        const command = sync ? CMD_SYNC_SCAN_PROJECTS : CMD_SCAN_PROJECTS;
        return await invoke(command);
    } catch (err) {
        logger.error("Failed to fetch projects from backend", err);
        throw err;
    }
};

export const updateProjectPinStatusOnBackend = async (id: string, pinned: boolean): Promise<boolean> => {
    try {
        await invoke(CMD_UPDATE_PROJECT_PIN_STATUS, { id, pinned });
        return true;
    } catch (err) {
        logger.error(`Failed to toggle project pin on backend: ${String(err)}`);
        throw err;
    }
};

export const updateProjectStatusOnBackend = async (id: string, status: ProjectStatus): Promise<boolean> => {
    try {
        await invoke(CMD_UPDATE_PROJECT_STATUS, { id, status });
        return true;
    } catch (err) {
        logger.error(`Failed to update project progress status on backend: ${String(err)}`);
        throw err;
    }
};

export const updateProjectTagsOnBackend = async (id: string, tags: string[]): Promise<boolean> => {
    try {
        await invoke(CMD_UPDATE_PROJECT_TAGS, { id, tags });
        return true;
    } catch (err) {
        logger.error(`Failed to update project tags: ${String(err)}`);
        throw err;
    }
};

export const scanProjectTagsOnBackend = async (project: Project): Promise<string[]> => {
    try {
        const tags:string[] = await invoke(CMD_SCAN_PROJECT_TAGS, { project });
        logger.info(`Project tags: ${JSON.stringify(tags,null,2)}`);
        return tags;
    } catch (err) {
        logger.error(`Failed to scan project tags: ${String(err)}`);
        throw err;
    }
};
