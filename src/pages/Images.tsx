import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../types/types';
import { fileInfoToItemData } from '../utility/util';

let cachedImagesData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Images: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedImagesData || { recent: [], all: [] });
    const [isRefreshing, setIsRefreshing] = useState(false);

    const openImage = async (I: ItemData) => {
        const path = I.path;
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

        const images: FileInfo[] = await invoke('scan_image', { path: "C:\\" });
        const item = fileInfoToItemData(images);
        const newData = {
            recent: [],
            all: item,
        };

        cachedImagesData = newData;
        setData(newData);
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (!cachedImagesData) {
            fetchData();
        }
    }, []);

    return (
        <PageLayout
            title="Images"
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
                    title="Images"
                    recentItems={data.recent}
                    allItems={data.all}
                    searchQuery={searchQuery}
                    onCardClick={openImage}
                />
            )}
        </PageLayout>
    );
};
