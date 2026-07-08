import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from '../types/types';
import { fileInfoToItemData } from '../utility/util';

let cachedMusicData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Music: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedMusicData || { recent: [], all: [] });
    const [isRefreshing, setIsRefreshing] = useState(false);


    const playMusic = async (m: ItemData) => {
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
        const item = fileInfoToItemData(musics);
        const newData = {
            recent: [],
            all: item,
        };

        cachedMusicData = newData;
        setData(newData);
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (!cachedMusicData) {
            fetchData();
        }
    }, []);

    return (
        <PageLayout
            title="Music"
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
                    title="Music"
                    recentItems={data.recent}
                    allItems={data.all}
                    searchQuery={searchQuery}
                    onCardClick={playMusic}
                />
            )}
        </PageLayout>
    );
};
