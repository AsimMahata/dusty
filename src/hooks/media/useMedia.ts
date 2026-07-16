import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE, CMD_GET_MEDIA_OF_TYPE } from '../../constants/commands';
import type { FileInfo, Tab, MediaDir, Item, MediaType } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { mediaExplorerTab, mediaListTab } from '../../constants/tabs';

// Cache for different media types
const cachedMediaDirs: Record<string, MediaDir[]> = {};

export const useMedia = (title: string, mediaType: MediaType, defaultPath: string = "C:\\") => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [mediaDirs, setMediaDirs] = useState<MediaDir[]>(cachedMediaDirs[mediaType] || []);
    const [currentDirHistory, setCurrentDirHistory] = useState<MediaDir[]>([]);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : null;

    const [activeTab, setActiveTab] = useState<Tab>(mediaExplorerTab);
    const tabs: Tab[] = [mediaExplorerTab, mediaListTab];

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

    const fetchData = async () => {
        setIsRefreshing(true);
        try {
            const media: MediaDir[] = await invoke(CMD_GET_MEDIA_OF_TYPE, { path: defaultPath, mediaType: mediaType });
            cachedMediaDirs[mediaType] = media;
            setMediaDirs(media);
            setCurrentDirHistory([]);
        } catch (e) {
            console.error("Failed to fetch media", e);
        }
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!cachedMediaDirs[mediaType]) {
            fetchData();
        }
    }, [mediaType]);

    const allMediaItems = useMemo(() => {
        const flat: FileInfo[] = [];
        const traverse = (dir: MediaDir) => {
            flat.push(...dir.media);
            dir.childs.forEach(traverse);
        };
        mediaDirs.forEach(traverse);
        return fileInfoToItemData(flat, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
    }, [mediaDirs]);

    const rootFolderItems = useMemo(() => {
        const files: FileInfo[] = mediaDirs.map(c => ({
            id: c.id,
            name: c.path.split(/[/\\]/).filter(Boolean).pop() || c.path,
            path: c.path,
            size: c.size || 0,
            is_dir: true,
        }));
        return fileInfoToItemData(files, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
    }, [mediaDirs]);

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
        canGoBack: currentDirHistory.length > 0
    };
};
