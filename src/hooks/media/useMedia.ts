import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE } from '../../constants/commands';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON, DEFAULT_STARTING_PATHS } from '../../constants/defaults';
import { mediaExplorerTab, mediaListTab } from '../../constants/tabs';
import { getRootFolders } from '../../utility/media/getRootFolders';
import { getMediaFolderIcon } from '../../utility/icon/getMediaFolderIcon';
import { getExplorerTabTitle } from '../../utility/tabs/getExplorerTabTitle';
import { fetchFlatMedia, fetchMediaTree } from '../../personalities/introverts/media/scan';
import type { FileInfo, MediaDir, MediaType } from "../../types/media";
import type { Tab } from "../../types/tabs";
import type { Item } from "../../types/core";

// Cache removed in favor of backend cache

export const useMedia = (title: string, mediaType: MediaType, defaultPaths: string[] = DEFAULT_STARTING_PATHS) => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [mediaDirs, setMediaDirs] = useState<MediaDir[]>([]);
    const [flatMedia, setFlatMedia] = useState<FileInfo[]>([]);
    const [currentDirHistory, setCurrentDirHistory] = useState<MediaDir[]>([]);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : null;

    const explorerTabTitle = getExplorerTabTitle();

    const explorerTab: Tab = useMemo(() => ({
        title: explorerTabTitle,
        type: mediaExplorerTab.type
    }), [explorerTabTitle]);

    const mediaListTabTitle = useMemo(() => {
        if (mediaType === 'music') return 'All Songs';
        if (mediaType === 'video') return 'All Videos';
        if (mediaType === 'image') return 'All Images';
        return 'All Media';
    }, [mediaType]);

    const listTab: Tab = useMemo(() => ({
        title: mediaListTabTitle,
        type: mediaListTab.type
    }), [mediaListTabTitle]);

    const [activeTab, setActiveTab] = useState<Tab>(explorerTab);
    const tabs: Tab[] = useMemo(() => [explorerTab, listTab], [explorerTab, listTab]);

    const playMedia = async (m: Item | FileInfo) => {
        const path = m.path;
        if (!path) return;
        try {
            await invoke(CMD_OPEN_FILE, { path });
        } catch (e) {
            console.error(`Could not open file: ${String(e)}`);
        }
    };

    const handleFolderClick = (child: MediaDir) => {
        setCurrentDirHistory([...currentDirHistory, child]);
    };

    const goBack = () => {
        if (currentDirHistory.length > 0) {
            setCurrentDirHistory(currentDirHistory.slice(0, -1));
        }
    };

    const fetchData = async (sync: boolean = false) => {
        setIsRefreshing(true);
        try {
            const [mediaTree, flat] = await Promise.all([
                fetchMediaTree(mediaType, defaultPaths, sync),
                fetchFlatMedia(mediaType, defaultPaths, sync)
            ]);
            setMediaDirs(mediaTree);
            setFlatMedia(flat);
            setCurrentDirHistory([]);
        } catch (e) {
            console.error("Failed to fetch media", e);
        }
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [mediaType]);

    const allMediaItems = useMemo(() => {
        return fileInfoToItemData(flatMedia, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
    }, [flatMedia]);

    const rootFolderItems = useMemo(() => {
        const folderIcon = getMediaFolderIcon(mediaType);
        const files = getRootFolders(mediaDirs);
        return fileInfoToItemData(files, DEFAULT_FILE_ICON, folderIcon);
    }, [mediaDirs, mediaType]);

    return {
        title,
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        mediaDirs,
        currentDir,
        allMediaItems,
        rootFolderItems,
        currentDirHistory,
        handleFolderClick,
        playMedia,
        goBack,
        isRefreshing,
        isLoading,
        fetchData,
        isItemSelected, setIsItemSelected,
        tabs,
        activeTab, setActiveTab,
        canGoBack: currentDirHistory.length > 0,
        mediaType,
        folderIcon: getMediaFolderIcon(mediaType)
    };
};
