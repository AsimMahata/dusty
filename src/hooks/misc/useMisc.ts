import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_SCAN_EMPTY_DIR } from '../../constants/commands';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { AnyItem } from '../../types/types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES } from '../../constants/tabs';

let cachedEmptyDirData: AnyItem[] | null = null;

export const useMisc = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState(TYPE_EMPTY_DIRECTORIES);
    const [data, setData] = useState<AnyItem[]>(cachedEmptyDirData || []);

    const fetchData = async () => {
        if (activeTab === TYPE_COMING_SOON) {
            setIsRefreshing(false);
            setIsLoading(false);
            return;
        }

        setIsRefreshing(true);
        setIsLoading(data.length === 0);
        try {
            const dirs: FileInfo[] = await invoke(CMD_SCAN_EMPTY_DIR);
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
        if (!cachedEmptyDirData && activeTab === TYPE_EMPTY_DIRECTORIES) {
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
