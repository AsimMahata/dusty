import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { PlayCircle, Tv } from 'lucide-react';
import { createIcon, formatSize } from '../utility/util.tsx';
import type { ShowResult } from '../types/types.ts';



// Cache
let cachedData: { recent: ItemData[], all: ItemData[] } | null = null;
let cachedShowsData: ShowResult[] | null = null;

export const Shows: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedData || { recent: [], all: [] });
    const [isRefreshing, setIsRefreshing] = useState(false);

    function convertIntoItemdData(shows: ShowResult[]): ItemData[] {
        return shows.map((show, i) => ({
            id: `show - ${i}`,
            title: show.title,
            subtitle: "NONE",
            icon: createIcon(Tv),
            path: show.dir,
            is_dir: false
        })).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        // Simulate backend network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        let shows: ShowResult[] = await invoke('scan_shows', { path: "C:\\" });
        let items = convertIntoItemdData(shows);

        const newData = {
            recent: [],
            all: items
        };

        cachedData = newData;
        cachedShowsData = shows;
        setData(newData);
        setIsRefreshing(false);
        console.log('shows', shows);
    };

    useEffect(() => {
        // Only fetch if we don't have cached data
        if (!cachedData) {
            fetchData();
        }
    }, []);

    const onCardClick = (item: ItemData) => {
        const recents = data.recent.filter(x => x.id !== item.id);

        const newData = {
            recent: [item, ...recents].slice(0, 3),
            all: data.all,
        };

        setSelectedItem(item);
        cachedData = newData;
        setData(newData);
    };

    const getChildrens = async (item: ItemData): Promise<ItemData[]> => {
        const show = cachedShowsData?.find(show => show.title === item.title);

        if (!show) return [];

        return show.episodes
            .map((ep, i) => ({
                id: `${item.id}-child-${i}`,
                title: ep.name,
                subtitle: ep.path,
                size: formatSize(ep.size),
                icon: <PlayCircle size={18} />,
                path: ep.path,
                is_dir: ep.is_dir
            }))
            .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    };

    const openEpisode = async (ep: ItemData) => {
        const path = ep.path;
        if (!path) return;
        try {
            await invoke("open_file", { path: path });
        } catch (e) {
            console.error(`Could not open file: ${String(e)}`);
        }
    }

    return (
        <PageLayout
            title="Shows"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideSearch={!!selectedItem}
            onRefresh={fetchData}
            isRefreshing={isRefreshing}
            isLoading={isRefreshing && data.all.length === 0}
        >
            {selectedItem ? (
                <ItemDetailPage
                    item={selectedItem}
                    getChildrens={getChildrens}
                    onBack={() => setSelectedItem(null)}
                    onClick={openEpisode}
                />
            ) : (
                <CategoryPage
                    title="Shows"
                    recentItems={data.recent}
                    allItems={data.all}
                    searchQuery={searchQuery}
                    onCardClick={onCardClick}
                />
            )}
        </PageLayout>
    );
};
