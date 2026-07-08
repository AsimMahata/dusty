import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../components/ItemDetailPage';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { createIcon, fileInfoToItemData } from '../utility/util';
import { FileCode2 } from 'lucide-react';
import type { FileInfo, Project } from '../types/types';

let cachedProjectsData: { recent: ItemData[], all: ItemData[] } | null = null;

export const Projects: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [data, setData] = useState<{ recent: ItemData[], all: ItemData[] }>(cachedProjectsData || { recent: [], all: [] });
    const [isRefreshing, setIsRefreshing] = useState(false);

    function convertIntoItemdData(projects: Project[]): ItemData[] {
        return projects.map((project, i) => ({
            id: `project - ${i}`,
            title: project.title,
            subtitle: "NONE",
            icon: createIcon(FileCode2),
            path: project.path,
            is_dir: true
        })).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));
    }

    const fetchData = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        const projects: Project[] = await invoke('scan_projects');
        console.log(projects);
        let items = convertIntoItemdData(projects);
        const newData = {
            recent: [],
            all: items
        };

        cachedProjectsData = newData;
        setData(newData);
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (!cachedProjectsData) {
            fetchData();
        }
    }, []);

    const getChildrens = async (item: ItemData): Promise<ItemData[]> => {
        if (!item.path) return [];
        try {
            let files: FileInfo[] = await invoke('read_dir', { path: item.path });
            return fileInfoToItemData(files);
        } catch (err) {
            console.error(`some error occured while reading this directory ${err}`);
            return [];
        }
    };

    const handleClick = async (child: ItemData) => {
        console.log(`clicked ${child}`);
    }
    return (
        <PageLayout
            title="Projects"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hideSearch={!!selectedItem}
            onRefresh={fetchData}
            isRefreshing={isRefreshing}
            isLoading={isRefreshing && data.all.length === 0}
        >
            {selectedItem ? (
                <ItemDetailPage item={selectedItem} getChildrens={getChildrens} onClick={handleClick} onBack={() => setSelectedItem(null)} />
            ) : (
                <CategoryPage
                    title="Projects"
                    recentItems={data.recent}
                    allItems={data.all}
                    searchQuery={searchQuery}
                    onCardClick={setSelectedItem}
                />
            )}
        </PageLayout>
    );
};
