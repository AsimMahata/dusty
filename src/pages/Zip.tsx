import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../types/types';
import { fileInfoToItemData } from '../utility/util';

let cachedZipData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Zip: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedZipData || { recent: [], all: [] });
    const [isRefreshing, setIsRefreshing] = useState(false);


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
        const item = fileInfoToItemData(zips);
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

    return (
        <PageLayout
            title="Zip"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideSearch={!!selectedItem}
            onRefresh={fetchData}
            isRefreshing={isRefreshing}
            isLoading={isRefreshing && data.all.length === 0}
        >
            {selectedItem ? (
                <ItemDetailPage item={selectedItem} onBack={() => setSelectedItem(null)} />
            ) : (
                <CategoryPage
                    title="Zip"
                    recentItems={data.recent}
                    allItems={data.all}
                    searchQuery={searchQuery}
                    onCardClick={openZip}
                />
            )}
        </PageLayout>
    );
};
