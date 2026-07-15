import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { ItemData } from '../../types/types';
import { useDefaults } from '../../contexts/defaultContext';

let cachedEmptyDirData: ItemData[] | null = null;

export const useMisc = () => {
    const { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } = useDefaults();
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState('empty_directories');
    const [data, setData] = useState<ItemData[]>(cachedEmptyDirData || []);

    const fetchData = async () => {
        if (activeTab === 'coming_soon') {
            setIsRefreshing(false);
            setIsLoading(false);
            return;
        }

        setIsRefreshing(true);
        setIsLoading(data.length === 0);
        try {
            const dirs: FileInfo[] = await invoke('scan_empty_dir');
            const items = fileInfoToItemData(dirs, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
            cachedEmptyDirData = items;
            setData(items);
        } catch (error) {
            console.error("Failed to fetch empty directories:", error);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!cachedEmptyDirData && activeTab === 'empty_directories') {
            fetchData();
        }
    }, [activeTab]);

    return {
        title: "Misc",
        searchQuery, setSearchQuery,
        isRefreshing,
        isLoading,
        fetchData,
        activeTab, setActiveTab,
        data
    };
};
