import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { ItemData } from '../../types/types';
import { useDefaults } from '../../contexts/defaultContext';

let cachedZipData: { recent: ItemData[], all: ItemData[] } | null = null;

export const useZip = () => {
    const { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } = useDefaults();
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedZipData || { recent: [], all: [] });

    const openZip = async (z: ItemData) => {
        const path = z.path;
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
        const zips: FileInfo[] = await invoke('scan_zip');
        const item = fileInfoToItemData(zips, DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON);
        const newData = {
            recent: [],
            all: item,
        };

        cachedZipData = newData;
        setData(newData);
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (!cachedZipData) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        setIsLoading(isRefreshing && data.all.length === 0);
    }, [isRefreshing, data.all.length, setIsLoading]);

    return {
        title: "Zip",
        searchQuery, setSearchQuery,
        selectedItem, setSelectedItem,
        data,
        isRefreshing,
        isLoading,
        openZip,
        fetchData
    };
};
