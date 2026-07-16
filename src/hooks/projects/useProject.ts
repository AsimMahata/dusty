import { useState, useEffect, type ReactNode } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_PROJECTS, CMD_UPDATE_PROJECT_PIN_STATUS, CMD_UPDATE_PROJECT_STATUS } from '../../constants/commands';
import type { Project, ProjectStatus } from '../../types/types';
import { logger } from '../../utility/logger';
import type { ItemCollection } from '../../types/types';

let cachedAllProjects: Project[] | null = null;

export const useProject = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<ItemCollection | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>(cachedAllProjects || []);

    const fetchData = async () => {
        setIsRefreshing(true);
        if (allProjects.length === 0) setIsLoading(true);
        try {
            const projects: Project[] = await invoke(CMD_SCAN_PROJECTS);
            cachedAllProjects = projects;
            setAllProjects(projects);
            logger.info('all projects fetched', projects);
        } catch (error) {
            logger.error(`Failed to fetch projects: ${String(error)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!cachedAllProjects) {
            fetchData();
        }
    }, []);

    const handleTogglePin = async (id: string) => {
        try {
            const currentPinnedStatus = allProjects.find(x => x.id === id)?.pinned || false;
            await invoke(CMD_UPDATE_PROJECT_PIN_STATUS, { id: id, pinned: !currentPinnedStatus });

            const newProjects = allProjects.map(item =>
                item.id === id ? { ...item, pinned: !item.pinned } : item
            );
            cachedAllProjects = newProjects;
            setAllProjects(newProjects);
            logger.info(`Toggled project pin for project ${id}`);
        } catch (err) {
            logger.error(`Failed to toggle project pin: ${String(err)}`);
        }
    };

    const getCommonRenderedActions = (): ReactNode[] => {
        return [];
    };

    const updateProjectProgressStatus = async (id: string, status: ProjectStatus): Promise<boolean> => {
        try {
            await invoke(CMD_UPDATE_PROJECT_STATUS, { id: id, status: status });
            const newProjects = allProjects.map(project =>
                project.id === id ? { ...project, status: status } : project
            );

            cachedAllProjects = newProjects;
            setAllProjects(newProjects);
            logger.info(`Updated project progress status for project ${id}`);
            return true;
        } catch (err) {
            logger.error(`Failed to update project progress status: ${String(err)}`);
            return false;
        }
    };

    return {
        title: "Projects",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        allProjects,
        isRefreshing,
        isLoading,
        fetchData,
        handleTogglePin,
        getCommonRenderedActions,
        updateProjectProgressStatus
    };
}
