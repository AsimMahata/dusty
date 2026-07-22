import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { scanEmptyDir } from '../../personalities/introverts/empty_dir/scan';
import { scanExe, scanExeTree } from '../../personalities/introverts/misc/exe';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TYPE_EXE_FILES } from '../../constants/tabs';
import type { FileInfo } from "../../types/media";
import type { ExecutableDir } from "../../types/exe";
import type { AnyItem } from "../../types/core";

export const useMisc = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState(TYPE_EMPTY_DIRECTORIES);
    const [data, setData] = useState<AnyItem[]>([]);
    const [exeTree, setExeTree] = useState<ExecutableDir[]>([]);
    const [currentDirHistory, setCurrentDirHistory] = useState<ExecutableDir[]>([]);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : null;

    const handleFolderClick = (folder: ExecutableDir) => {
        setCurrentDirHistory(prev => [...prev, folder]);
    };

    const goBack = () => {
        if (currentDirHistory.length > 0) {
            setCurrentDirHistory(prev => prev.slice(0, -1));
        }
    };

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
                const [files, tree] = await Promise.all([
                    scanExe(sync),
                    scanExeTree(sync)
                ]);
                const items = fileInfoToItemData(files, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
                setData(items);
                setExeTree(tree);
                setCurrentDirHistory([]);
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
        data,
        exeTree,
        currentDir,
        currentDirHistory,
        handleFolderClick,
        goBack,
        canGoBack: currentDirHistory.length > 0,
    };
};
