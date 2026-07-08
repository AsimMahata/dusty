import React, { useState, useEffect } from 'react';
import { CategoryPage } from '../components/CategoryPage';
import { type ItemData } from '../components/ItemDetailPage';
import { FileExplorer } from '../components/FileExplorer';
import { PageLayout } from '../components/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { createIcon } from '../utility/util';
import { FileCode2 } from 'lucide-react';
import type { Project } from '../types/types';

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
            {selectedItem && selectedItem.path ? (
                <FileExplorer 
                    initialPath={selectedItem.path} 
                    title={selectedItem.title} 
                    onBack={() => setSelectedItem(null)} 
                />
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
