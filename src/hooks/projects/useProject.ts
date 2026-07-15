import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { Project } from '../../types/types';
import { logger } from '../../utility/logger';
import type { ItemData } from '../../types/types';
import { useDefaults } from '../../contexts/defaultContext';

let cachedProjectsData: { recent: ItemData[], all: ItemData[] } | null = null;

export const useProject = () => {
    const { DEFAULT_PROJECT_ICON } = useDefaults();
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedProjectsData || { recent: [], all: [] });

    function convertIntoItemdData(projects: Project[]): ItemData[] {
        return projects.map((project, i) => ({
            id: `project - ${i}`,
            title: project.title,
            subtitle: "NONE",
            icon: DEFAULT_PROJECT_ICON,
            path: project.path,
            is_dir: true,
            is_pinned: project.is_pinned || false
        })).sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return a.title.localeCompare(b.title, undefined, { numeric: true });
        });
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        const projects: Project[] = await invoke('scan_projects');
        console.log(projects);
        let items = convertIntoItemdData(projects);
        const newData = {
            recent: [],
            all: items
        };

        cachedProjectsData = newData;
        setData(newData);
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!cachedProjectsData) {
            fetchData();
        }
    }, []);

    const handleTogglePin = (id: string) => {
        logger.warn(`TODO: implement backend command to persist pin status for project ${id}`);
        const newData = {
            ...data,
            all: data.all.map(item => 
                item.id === id ? { ...item, is_pinned: !item.is_pinned } : item
            ).sort((a, b) => {
                if (a.is_pinned && !b.is_pinned) return -1;
                if (!a.is_pinned && b.is_pinned) return 1;
                return a.title.localeCompare(b.title, undefined, { numeric: true });
            }),
            recent: data.recent.map(item => 
                item.id === id ? { ...item, is_pinned: !item.is_pinned } : item
            )
        };
        cachedProjectsData = newData;
        setData(newData);
    };

    return {
        title: "Projects",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        data,
        recentItems: data.recent,
        allItems: data.all,
        onCardClick: setSelectedItem,
        isRefreshing,
        isLoading,
        fetchData,
        handleTogglePin
    };
}
