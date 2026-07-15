import React, { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { CategoryPage } from '../../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../../components/ItemDetailPage';
import { createIcon } from '../../utility/util';
import type { ShowResult } from '../../types/types';
import { UnbanButton } from './actions/UnbanButton';
import { getChildrens, openEpisode } from './utility';
import { DEFAULT_SHOW_ICON } from '../../utility/defaults';

let cachedRecentItems: ItemData[] = [];

import { logger } from '../../utility/logger';

interface BannedShowsProps {
    searchQuery: string;
    shows: ShowResult[];
    onItemSelected: (isSelected: boolean) => void;
    onStatusChange: (showId: string) => void;
    onRename: (showId: string, newTitle: string) => Promise<void>;
    commonRenderedActions: React.ReactNode[];
}

export const BannedShows: React.FC<BannedShowsProps> = ({ searchQuery, shows, onItemSelected, onStatusChange, onRename, commonRenderedActions }) => {
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [recentItems, setRecentItems] = useState<ItemData[]>(cachedRecentItems);

    const allItems = shows.map((show) => ({
        id: show.id,
        title: show.title,
        subtitle: `Found ${show.num_episodes} episodes`,
        icon: createIcon(Tv),
        path: show.dir,
        is_dir: false
    })).sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));

    useEffect(() => {
        onItemSelected(!!selectedItem);
    }, [selectedItem, onItemSelected]);

    const onCardClick = (item: ItemData) => {
        const recents = recentItems.filter(x => x.id !== item.id);
        const newRecents = [item, ...recents].slice(0, 3);
        setRecentItems(newRecents);
        cachedRecentItems = newRecents;
        setSelectedItem(item);
    };



    const handleRename = async (item: ItemData, newTitle: string) => {
        await onRename(item.id, newTitle);
        
        setSelectedItem({ ...item, title: newTitle });
        
        const newRecents = recentItems.map(x => x.id === item.id ? { ...x, title: newTitle } : x);
        setRecentItems(newRecents);
        cachedRecentItems = newRecents;
    };

    const getRenderActions = (item: ItemData): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        actions.push(...commonRenderedActions);
        actions.push(<UnbanButton key="unban" item={item} onComplete={(item) => {
            const newRecents = recentItems.filter(x => x.id !== item.id);
            setRecentItems(newRecents);
            cachedRecentItems = newRecents;
            setSelectedItem(null);
            onStatusChange(item.id);
        }} />);
        return actions;
    };

    if (selectedItem) {
        return (
            <ItemDetailPage
                item={selectedItem}
                getChildrens={(item) => getChildrens(item, shows)}
                onBack={() => setSelectedItem(null)}
                onClick={openEpisode}
                renderActions={getRenderActions}
                defaultIcon={DEFAULT_SHOW_ICON}
                onRename={handleRename}
            />
        );
    }

    return (
        <CategoryPage
            title="Banned Shows"
            recentItems={recentItems}
            allItems={allItems}
            searchQuery={searchQuery}
            onCardClick={onCardClick}
        />
    );
};
