import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE, CMD_SCAN_ZIP } from '../../constants/commands';
import type { FileInfo } from '../../types/types';
import { fileInfoToItemData } from '../../utility/util';
import type { Item } from '../../types/types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON } from '../../constants/defaults';

let cachedZipData: { recent: Item[], all: Item[] } | null = null;

export const useZip = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [data, setData] = useState<{ recent: Item[], all: Item[] }>(cachedZipData || { recent: [], all: [] });

    const openZip = async (z: Item) => {
        const path = z.path;
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
        const zips: FileInfo[] = await invoke(CMD_SCAN_ZIP);
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
