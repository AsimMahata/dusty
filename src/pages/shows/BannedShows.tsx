import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { PlayCircle, Tv } from 'lucide-react';
import { CategoryPage } from '../../components/CategoryPage';
import { ItemDetailPage, type ItemData } from '../../components/ItemDetailPage';
import { createIcon, formatSize } from '../../utility/util';
import type { ShowResult } from '../../types/types';
import { logger } from '../../utility/logger';

let cachedRecentItems: ItemData[] = [];

const unbanShow = async (item: ItemData) => {
    logger.info('requested unban for', { id: item.id, title: item.title });
    await invoke("unban_show", { showId: item.id });
};

const UnbanButton: React.FC<{ item: ItemData; onUnban: (item: ItemData) => void }> = ({ item, onUnban }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isConfirming) {
            timeout = setTimeout(() => setIsConfirming(false), 3000);
        }
        return () => clearTimeout(timeout);
    }, [isConfirming]);

    const handleClick = () => {
        if (isConfirming) {
            onUnban(item);
        } else {
            setIsConfirming(true);
        }
    };

    let bg = '#16a34a'; // default green
    if (isConfirming) bg = '#14532d'; // darker green
    else if (isHovered) bg = '#15803d'; // hover green

    return (
        <button
            style={{
                padding: '0.4rem 1rem',
                backgroundColor: bg,
                color: 'white',
                border: isConfirming ? '1px solid #4ade80' : '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                minWidth: isConfirming ? '120px' : '80px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isConfirming ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isConfirming ? '0 0 15px rgba(22, 163, 74, 0.6)' : 'none',
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isConfirming ? 'Are you sure?' : 'Unban'}
        </button>
    );
};

interface BannedShowsProps {
    searchQuery: string;
    shows: ShowResult[];
    onItemSelected: (isSelected: boolean) => void;
    onStatusChange: (showId: string) => void;
}

export const BannedShows: React.FC<BannedShowsProps> = ({ searchQuery, shows, onItemSelected, onStatusChange }) => {
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

    const getChildrens = async (item: ItemData): Promise<ItemData[]> => {
        const show = shows.find(show => show.title === item.title);
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
            logger.error(`Could not open file: ${String(e)}`);
        }
    }

    const getRenderActions = (item: ItemData): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        actions.push(<UnbanButton key="unban" item={item} onUnban={async (item) => {
            await unbanShow(item);
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
                getChildrens={getChildrens}
                onBack={() => setSelectedItem(null)}
                onClick={openEpisode}
                renderActions={getRenderActions}
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
