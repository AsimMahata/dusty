import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useCommon } from '../useCommon';
import { getProjectsFromBackend, updateProjectPinStatusOnBackend, updateProjectStatusOnBackend } from '../../personalities/ambiverts/projects';
import { openFileInExplorer } from '../../personalities/introverts/filesystem/filesystem';
import { logger } from '../../utility/logger';
import { filterAndSortProjects } from '../../pages/projects/actions/filter';
import { DEFAULT_SORT_OPTION } from '../../pages/projects/constants/constants';
import type { GitInfo, Project, ProjectStatus } from "../../types/projects";
import type { SortOption } from "../../types/projects";
import { invoke } from '@tauri-apps/api/core';


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
    const [gitInfo, setGitInfo] = useState<GitInfo | undefined>();
    const explorePath = explorePathHistory.length > 0 ? explorePathHistory[explorePathHistory.length - 1] : null;

    useEffect(() => {
        if (!selectedItem?.path) {
            setGitInfo(undefined);
            return;
        }

        const fetchGitInfo = async () => {
            const git_info = await invoke<GitInfo>("get_git_info", {
                path: selectedItem.path,
            });

            logger.info('RECIEVED GIT INFO', git_info);
            setGitInfo(git_info);
        };

        fetchGitInfo();
    }, [selectedItem]);

    const handleExploreItemClick = (file: any) => {
        if (file.is_dir) {
            setExplorePathHistory(prev => [...prev, file.path]);
        } else {
            void openFileInExplorer(file.path);
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
            const projects = await getProjectsFromBackend(sync);
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
            await updateProjectPinStatusOnBackend(id, !currentPinnedStatus);

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
            await updateProjectStatusOnBackend(id, status);
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
        gitInfo, setGitInfo,
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
