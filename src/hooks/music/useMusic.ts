import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { Item } from '../../types/types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';

let cachedMusicData: { recent: Item[], all: Item[] } | null = null;

export const useMusic = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [data, setData] = useState<{ recent: Item[], all: Item[] }>(cachedMusicData || { recent: [], all: [] });

    const playMusic = async (m: Item) => {
        const path = m.path;
        if (!path) return;
        try {
            await invoke("open_file", { path: path });
        } catch (e) {
            console.error(`Could not open file: ${String(e)}`);
        }
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        const musics: FileInfo[] = await invoke('scan_music', { path: "C:\\" });
        const item = fileInfoToItemData(musics, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
        const newData = {
            recent: [],
            all: item,
        };

        cachedMusicData = newData;
        setData(newData);
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!cachedMusicData) {
            fetchData();
        }
    }, []);

    return {
        title: "Music",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        data,
        recentItems: data.recent,
        allItems: data.all,
        onCardClick: playMusic,
        isRefreshing,
        isLoading,
        playMusic,
        fetchData
    };
}
