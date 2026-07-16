import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE, CMD_SCAN_IMAGE } from '../../constants/commands';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { Item } from '../../types/types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';

let cachedImagesData: { recent: Item[], all: Item[] } | null = null;

export const useImage = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [data, setData] = useState<{ recent: Item[], all: Item[] }>(cachedImagesData || { recent: [], all: [] });

    const openImage = async (I: Item) => {
        const path = I.path;
        if (!path) return;
        try {
            await invoke(CMD_OPEN_FILE, { path: path });
        } catch (e) {
            console.error(`Could not open file: ${String(e)}`);
        }
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        const images: FileInfo[] = await invoke(CMD_SCAN_IMAGE, { path: "C:\\" });
        const item = fileInfoToItemData(images, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
        const newData = {
            recent: [],
            all: item,
        };

        cachedImagesData = newData;
        setData(newData);
        setIsRefreshing(false);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!cachedImagesData) {
            // fetchData();
        }
    }, []);

    return {
        title: "Images",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        data,
        recentItems: data.recent,
        allItems: data.all,
        onCardClick: openImage,
        isRefreshing,
        isLoading,
        openImage,
        fetchData
    };
}
