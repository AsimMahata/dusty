import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useCommon } from '../../../hooks/useCommon';
import { getProjects, updateProjectPinStatus, updateProjectStatus, updateProjectTags, getGitInfo, fetchProjectsGitStatus } from '../../../personalities/introverts/projects/projects';
import { openFileInExplorer } from '../../../personalities/introverts/filesystem/filesystem';
import { logger } from '../../../utility/logger';
import { filterAndSortProjects } from '../actions/filter';
import type { GitInfo, Project, ProjectStatus } from '../types/types';
import type { SortOption } from '../types/types';

import { getSortOptionProjectsPage, getDefaultSortOption, setSortOptionProjectsPage, getSortAscendingProjectsPage, getDefaultSortAscending, setSortAscendingProjectsPage } from '../config/sort';

export const useProject = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [isGitStatusLoading, setIsGitStatusLoading] = useState<boolean>(false);
    const [sortOption, setSortOptionState] = useState<SortOption>(getDefaultSortOption());
    const [sortAscending, setSortAscendingState] = useState<boolean>(getDefaultSortAscending());

    async function fetchConfigData() {
        try {
            const option = await getSortOptionProjectsPage();
            setSortOptionState(option);
        } catch (e) { }
        try {
            const ascending = await getSortAscendingProjectsPage();
            setSortAscendingState(ascending);
        } catch (e) { }
    }

    const setSortOption = (option: SortOption) => {
        setSortOptionState(option);
        void setSortOptionProjectsPage(option);
    };

    const setSortAscending = (ascending: boolean) => {
        setSortAscendingState(ascending);
        void setSortAscendingProjectsPage(ascending);
    };

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
            const git_info = await getGitInfo(selectedItem.path);

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
        return filterAndSortProjects(allProjects, searchQuery || "", sortOption, sortAscending);
    }, [allProjects, searchQuery, sortOption, sortAscending]);

    const fetchGitStatusBackground = async () => {
        setIsGitStatusLoading(true);
        try {
            const gitStatusMap = await fetchProjectsGitStatus();
            if (gitStatusMap && Object.keys(gitStatusMap).length > 0) {
                setAllProjects(prevProjects =>
                    prevProjects.map(project => {
                        const info = gitStatusMap[project.id];
                        return info ? { ...project, git_info: info } : project;
                    })
                );
                logger.info('git statuses fetched and updated for projects', Object.keys(gitStatusMap).length);
            }
        } catch (error) {
            logger.error(`Failed to fetch git status in background: ${String(error)}`);
        } finally {
            setIsGitStatusLoading(false);
        }
    };


    const fetchData = async (sync: boolean = false) => {
        setIsRefreshing(true);
        if (allProjects.length === 0) setIsLoading(true);
        try {
            const projects = await getProjects(sync);
            setAllProjects(projects);
            logger.info('all projects fetched', projects.length);
            void fetchGitStatusBackground();
        } catch (error) {
            logger.error(`Failed to fetch projects: ${String(error)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchConfigData();
        fetchData();
    }, []);

    const handleTogglePin = async (id: string) => {
        try {
            const currentPinnedStatus = allProjects.find(x => x.id === id)?.pinned || false;
            await updateProjectPinStatus(id, !currentPinnedStatus);

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
            await updateProjectStatus(id, status);
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

    const updateProjectTagsLocal = async (id: string, tags: string[]): Promise<boolean> => {
        try {
            await updateProjectTags(id, tags);
            setAllProjects(projects => projects.map(project =>
                project.id === id ? { ...project, tags } : project
            ));
            if (selectedItem?.id === id) {
                setSelectedItem({ ...selectedItem, tags: tags });
            }
            logger.info(`Updated project tags for project ${id}`);
            return true;
        } catch (err) {
            logger.error(`Failed to update project tags: ${String(err)}`);
            return false;
        }
    };

    const handleRename = (project: Project) => {
        logger.todo(`Implement Rename for project: ${project.title}`);
    };

    const handleDelete = (project: Project) => {
        logger.todo(`Implement Delete for project: ${project.title}`);
    };

    return {
        title: "Projects",
        searchQuery, setSearchQuery,
        gitInfo, setGitInfo,
        selectedItem, setSelectedItem,
        allProjects,
        isRefreshing,
        isLoading,
        isGitStatusLoading,
        fetchData,

        handleTogglePin,
        getCommonRenderedActions,
        updateProjectProgressStatus,
        updateProjectTags: updateProjectTagsLocal,
        handleRename,
        handleDelete,
        sortOption, setSortOption,
        sortAscending, setSortAscending,
        displayProjects,
        contextMenu, setContextMenu,
        changingStatusProject, setChangingStatusProject,
        editingTagsProject, setEditingTagsProject,
        explorePath, explorePathHistory,
        handleExploreItemClick, handleExploreBack, closeExplorer, startExploring
    };
};
