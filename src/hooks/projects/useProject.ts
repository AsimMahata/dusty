import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_PROJECTS, CMD_SYNC_SCAN_PROJECTS, CMD_UPDATE_PROJECT_PIN_STATUS, CMD_UPDATE_PROJECT_STATUS } from '../../constants/commands';
import type { Project, ProjectStatus } from '../../types/types';
import { logger } from '../../utility/logger';
import { filterAndSortProjects } from '../../pages/projects/actions/filter';
import { DEFAULT_SORT_OPTION, type SortOption } from '../../pages/projects/constants/constants';

// Cache removed to rely on backend SQLite caching

export const useProject = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION);
    
    // UI states
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, project: Project } | null>(null);
    const [changingStatusProject, setChangingStatusProject] = useState<Project | null>(null);
    const [editingTagsProject, setEditingTagsProject] = useState<Project | null>(null);
    const [explorePathHistory, setExplorePathHistory] = useState<string[]>([]);
    const explorePath = explorePathHistory.length > 0 ? explorePathHistory[explorePathHistory.length - 1] : null;

    const handleExploreItemClick = (file: any) => {
        if (file.is_dir) {
            setExplorePathHistory(prev => [...prev, file.path]);
        } else {
            invoke('cmd_open_file', { path: file.path }).catch(console.error);
        }
    };

    const handleExploreBack = () => {
        setExplorePathHistory(prev => prev.slice(0, -1));
    };

    const closeExplorer = () => {
        setExplorePathHistory([]);
    };

    const startExploring = (path: string) => {
        setExplorePathHistory([path]);
    };

    const displayProjects = useMemo(() => {
        return filterAndSortProjects(allProjects, searchQuery || "", sortOption);
    }, [allProjects, searchQuery, sortOption]);

    const fetchData = async (sync: boolean = false) => {
        setIsRefreshing(true);
        if (allProjects.length === 0) setIsLoading(true);
        try {
            const command = sync ? CMD_SYNC_SCAN_PROJECTS : CMD_SCAN_PROJECTS;
            const projects: Project[] = await invoke(command);
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
        fetchData();
    }, []);

    const handleTogglePin = async (id: string) => {
        try {
            const currentPinnedStatus = allProjects.find(x => x.id === id)?.pinned || false;
            await invoke(CMD_UPDATE_PROJECT_PIN_STATUS, { id: id, pinned: !currentPinnedStatus });

            const newProjects = allProjects.map(item =>
                item.id === id ? { ...item, pinned: !item.pinned } : item
            );
            setAllProjects(newProjects);
            if (selectedItem?.id === id) {
                setSelectedItem({ ...selectedItem, pinned: !currentPinnedStatus });
            }
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

            setAllProjects(newProjects);
            if (selectedItem?.id === id) {
                setSelectedItem({ ...selectedItem, status: status });
            }
            logger.info(`Updated project progress status for project ${id}`);
            return true;
        } catch (err) {
            logger.error(`Failed to update project progress status: ${String(err)}`);
            return false;
        }
    };

    const updateProjectTags = (id: string, tags: string[]) => {
        if (selectedItem?.id === id) {
            setSelectedItem({ ...selectedItem, tags: tags });
        }
    };

    const handleRename = (project: Project) => {
        logger.info(`TODO: Implement Rename for project: ${project.title}`);
    };

    const handleDelete = (project: Project) => {
        logger.info(`TODO: Implement Delete for project: ${project.title}`);
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
        updateProjectProgressStatus,
        updateProjectTags,
        handleRename,
        handleDelete,
        sortOption, setSortOption,
        displayProjects,
        contextMenu, setContextMenu,
        changingStatusProject, setChangingStatusProject,
        editingTagsProject, setEditingTagsProject,
        explorePath, explorePathHistory, 
        handleExploreItemClick, handleExploreBack, closeExplorer, startExploring
    };
};

export type ProjectHook = ReturnType<typeof useProject>;
