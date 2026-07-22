import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { scanEmptyDir } from '../../personalities/introverts/empty_dir/scan';
import { scanExe } from '../../personalities/introverts/misc/exe';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TYPE_EXE_FILES } from '../../constants/tabs';
import type { FileInfo } from "../../types/media";
import type { AnyItem } from "../../types/core";

export const useMisc = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState(TYPE_EMPTY_DIRECTORIES);
    const [data, setData] = useState<AnyItem[]>([]);

    const fetchData = async (sync: boolean = false) => {
        if (activeTab === TYPE_COMING_SOON) {
            setIsRefreshing(false);
            setIsLoading(false);
            return;
        }

        if (sync) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            if (activeTab === TYPE_EMPTY_DIRECTORIES) {
                const dirs: FileInfo[] = await scanEmptyDir(sync);
                const items = fileInfoToItemData(dirs, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
                setData(items);
            } else if (activeTab === TYPE_EXE_FILES) {
                const files: FileInfo[] = await scanExe(sync);
                const items = fileInfoToItemData(files, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
                setData(items);
            }
        } catch (error) {
            console.error(`Failed to fetch data for tab ${activeTab}:`, error);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab !== TYPE_COMING_SOON) {
            fetchData(false);
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
