import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { PlayCircle, Tv } from 'lucide-react';
import { createIcon, formatSize } from '../utility/util.tsx';


export interface FileInfo {
    name: string,
    path: string,
    size: number,
    ext: string,
}
export interface ShowResult {
    title: string,
    num_episodes: number,
    episodes: FileInfo[],
    dir: string,
}


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
        }));
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

    const getChildrens = (item: ItemData): ItemData[] => {
        const show = cachedShowsData?.find(show => show.title === item.title);

        if (!show) return [];

        return show.episodes.map((ep, i) => {
            return {
                id: `${item.id}-child-${i}`,
                title: ep.name,
                subtitle: ep.path,
                size: formatSize(ep.size),
                icon: <PlayCircle size={18} />,
                path: ep.path,
            };
        });
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
                    childrens={getChildrens(selectedItem)}
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
