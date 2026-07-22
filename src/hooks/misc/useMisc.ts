import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { scanEmptyDir } from '../../personalities/introverts/empty_dir/scan';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES } from '../../constants/tabs';
import type { FileInfo } from "../../types/media";
import type { AnyItem } from "../../types/core";

let cachedEmptyDirData: AnyItem[] | null = null;

export const useMisc = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState(TYPE_EMPTY_DIRECTORIES);
    const [data, setData] = useState<AnyItem[]>(cachedEmptyDirData || []);

    const fetchData = async (sync: boolean = false) => {
        if (activeTab === TYPE_COMING_SOON) {
            setIsRefreshing(false);
            setIsLoading(false);
            return;
        }

        setIsRefreshing(true);
        if (data.length === 0) setIsLoading(true);
        try {
            const dirs: FileInfo[] = await scanEmptyDir(sync);
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
