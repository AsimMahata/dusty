import { invoke } from "@tauri-apps/api/core";
import { logger } from "../../utility/logger";
import type { Project, ProjectStatus } from '../../pages/projects/types/types';

/*
dusty::api::project::scan_projects,
dusty::api::project::sync_scan_projects,
dusty::api::project::update_project_pin_status,
dusty::api::project::update_project_status,
dusty::api::project::update_project_tags,
dusty::api::project::scan_project_tags,
*/

const CMD_UPDATE_PROJECT_PIN_STATUS = 'update_project_pin_status';
const CMD_UPDATE_PROJECT_STATUS = 'update_project_status';
const CMD_UPDATE_PROJECT_TAGS = 'update_project_tags';
const CMD_SCAN_PROJECT_TAGS = 'scan_project_tags';

const CMD_SCAN_PROJECTS = 'scan_projects';
const CMD_SYNC_SCAN_PROJECTS = 'sync_scan_projects';

export async function getProjectsIPC(sync: boolean = false): Promise<Project[]> {
    try {
        const command = sync ? CMD_SYNC_SCAN_PROJECTS : CMD_SCAN_PROJECTS;
        let result = await invoke<Project[]>(command);
        return result;
    } catch (error) {
        logger.error(`getProjectsIPC error: ${error}`);
        return [];
    }
}

export async function updateProjectPinStatusIPC(id: string, pinned: boolean): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_PROJECT_PIN_STATUS, { id, pinned });
        return result;
    } catch (error) {
        logger.error(`updateProjectPinStatusIPC error: ${error}`);
        return false;
    }
}

export async function updateProjectStatusIPC(id: string, status: ProjectStatus): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_PROJECT_STATUS, { id, status });
        return result;
    } catch (error) {
        logger.error(`updateProjectStatusIPC error: ${error}`);
        return false;
    }
}

export async function updateProjectTagsIPC(id: string, tags: string[]): Promise<boolean> {
    try {
        let result = await invoke<boolean>(CMD_UPDATE_PROJECT_TAGS, { id, tags });
        return result;
    } catch (error) {
        logger.error(`updateProjectTagsIPC error: ${error}`);
        return false;
    }
}

export async function scanProjectTagsIPC(project: Project): Promise<string[]> {
    try {
        let result = await invoke<string[]>(CMD_SCAN_PROJECT_TAGS, { project });
        return result;
    } catch (error) {
        logger.error(`scanProjectTagsIPC error: ${error}`);
        return [];
    }
}
