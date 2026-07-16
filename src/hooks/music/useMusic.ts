import { useState, useEffect, useMemo } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo, Tab, MediaDir, Item } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';
import { musicDirTab, musicTab } from '../../constants/tabs';

let cachedMediaDir: MediaDir | null = null;

export const useMusic = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [isItemSelected, setIsItemSelected] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [mediaDir, setMediaDir] = useState<MediaDir | null>(cachedMediaDir);
    const [currentDirHistory, setCurrentDirHistory] = useState<MediaDir[]>([]);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : mediaDir;

    const [activeTab, setActiveTab] = useState<Tab>(musicDirTab);
    const tabs: Tab[] = [musicDirTab, musicTab];

    const playMusic = async (m: Item) => {
        if (m.is_dir) {
            // Find the child MediaDir
            const childDir = currentDir?.childs.find(c => c.id === m.id);
            if (childDir) {
                setCurrentDirHistory([...currentDirHistory, childDir]);
            }
            return;
        }

        const path = m.path;
        if (!path) return;
        try {
            await invoke("open_file", { path: path });
        } catch (e) {
            console.error(`Could not open file: ${String(e)}`);
        }
    }
    
    const goBack = () => {
        if (currentDirHistory.length > 0) {
            setCurrentDirHistory(currentDirHistory.slice(0, -1));
        }
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        try {
            const media: MediaDir | null = await invoke('get_media_of_type', { path: "C:\\", media_type: "music" });
            if (media) {
                cachedMediaDir = media;
                setMediaDir(media);
                setCurrentDirHistory([]);
            }
        } catch (e) {
            console.error("Failed to fetch media", e);
        }
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!cachedMediaDir) {
            fetchData();
        }
    }, []);

    const allSongs = useMemo(() => {
        const flat: FileInfo[] = [];
        const traverse = (dir: MediaDir) => {
            flat.push(...dir.media);
            dir.childs.forEach(traverse);
        };
        if (mediaDir) traverse(mediaDir);
        return fileInfoToItemData(flat, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
    }, [mediaDir]);

    const currentDirItems = useMemo(() => {
        if (!currentDir) return [];
        const folders = currentDir.childs.map(c => ({
             id: c.id,
             title: c.path.split('\\').pop() || c.path,
             subtitle: 'Folder',
             path: c.path,
             is_dir: true,
             icon: DEFAULT_FOLDER_ICON
        } as Item));
        const files = fileInfoToItemData(currentDir.media, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
        return [...folders, ...files];
    }, [currentDir]);

    return {
        title: "Music",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        currentDirItems,
        allSongs,
        onCardClick: playMusic,
        goBack,
        isRefreshing,
        isLoading,
        playMusic,
        fetchData,
        isItemSelected, setIsItemSelected,
        tabs,
        activeTab, setActiveTab,
        canGoBack: currentDirHistory.length > 0
    };
}
