import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_PROJECTS, CMD_UPDATE_PROJECT_PIN_STATUS, CMD_UPDATE_PROJECT_STATUS } from '../../constants/commands';
import type { Project, ProjectStatus } from '../../types/types';
import { logger } from '../../utility/logger';
import type { SortOption } from '../../pages/projects/ProjectToolbar';

const filterAndSortProjects = (projects: Project[], searchQuery: string, sortOption: SortOption): Project[] => {
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/).filter(Boolean);
    
    let filtered = projects;
    if (searchTerms.length > 0) {
        filtered = projects.filter(project => {
            const tags = (project.tags || []).map(t => t.toLowerCase());
            const title = project.title.toLowerCase();
            return searchTerms.every(term => 
                tags.some(tag => tag.includes(term)) || title.includes(term)
            );
        });
    }

    return [...filtered].sort((a, b) => {
        switch (sortOption) {
            case "alphabetical":
                return a.title.localeCompare(b.title);
            case "pinned":
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                return a.title.localeCompare(b.title);
            case "git_status":
                return (a.git_status || "clean").localeCompare(b.git_status || "clean");
            case "project_status":
                return (a.status || "default").localeCompare(b.status || "default");
            case "recently_opened":
                return (b.last_opened ? Date.parse(b.last_opened) : 0) - (a.last_opened ? Date.parse(a.last_opened) : 0);
            case "recently_modified":
                return (b.last_modified ? Date.parse(b.last_modified) : 0) - (a.last_modified ? Date.parse(a.last_modified) : 0);
            default:
                return 0;
        }
    });
};

let cachedAllProjects: Project[] | null = null;

export const useProject = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>(cachedAllProjects || []);
    const [sortOption, setSortOption] = useState<SortOption>("recently_opened");
    
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
        updateProjectProgressStatus,
        sortOption, setSortOption,
        displayProjects,
        contextMenu, setContextMenu,
        changingStatusProject, setChangingStatusProject,
        editingTagsProject, setEditingTagsProject,
        explorePath, explorePathHistory, 
        handleExploreItemClick, handleExploreBack, closeExplorer, startExploring
    };
}
