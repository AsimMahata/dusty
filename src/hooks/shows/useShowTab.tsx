import React, { useState, useEffect } from 'react';
import type { ItemData } from '../../types/types';
import type { useShow } from './useShow';
import { useDefaults } from '../../contexts/defaultContext';
import { BanButton } from '../../pages/shows/actions/BanButton';
import { UnbanButton } from '../../pages/shows/actions/UnbanButton';
import { getChildrens, openEpisode } from '../../pages/shows/utility';

let cachedRecentItems: Record<'normal' | 'banned', ItemData[]> = {
    normal: [],
    banned: []
};

export const useShowTab = (show: ReturnType<typeof useShow>, tabType: 'normal' | 'banned') => {
    const { DEFAULT_TV_ICON, DEFAULT_SHOW_ICON } = useDefaults();
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [recentItems, setRecentItems] = useState<ItemData[]>(cachedRecentItems[tabType]);

    const isBanned = tabType === 'banned';
    const filteredShows = show.allShows.filter(s => s.is_banned === isBanned);

    const allItems = filteredShows.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: `Found ${s.num_episodes} episodes`,
        icon: DEFAULT_TV_ICON,
        path: s.dir,
        is_dir: false,
        is_pinned: s.is_pinned || false
    })).sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return a.title.localeCompare(b.title, undefined, { numeric: true });
    });

    useEffect(() => {
        show.setIsItemSelected(!!selectedItem);
    }, [selectedItem, show.setIsItemSelected]);

    const onCardClick = (item: ItemData) => {
        const recents = recentItems.filter(x => x.id !== item.id);
        const newRecents = [item, ...recents].slice(0, 3);
        setRecentItems(newRecents);
        cachedRecentItems[tabType] = newRecents;
        setSelectedItem(item);
    };

    const handleRename = async (item: ItemData, newTitle: string) => {
        await show.updateShowTitle(item.id, newTitle);
        setSelectedItem({ ...item, title: newTitle });
        const newRecents = recentItems.map(x => x.id === item.id ? { ...x, title: newTitle } : x);
        setRecentItems(newRecents);
        cachedRecentItems[tabType] = newRecents;
    };

    const getRenderActions = (item: ItemData): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        actions.push(...show.getCommonRenderedActions());
        
        if (tabType === 'normal') {
            actions.push(<BanButton key="ban" item={item} onComplete={(item) => {
                const newRecents = recentItems.filter(x => x.id !== item.id);
                setRecentItems(newRecents);
                cachedRecentItems[tabType] = newRecents;
                setSelectedItem(null);
                show.updateShowStatus(item.id, true);
            }} />);
        } else {
            actions.push(<UnbanButton key="unban" item={item} onComplete={(item) => {
                const newRecents = recentItems.filter(x => x.id !== item.id);
                setRecentItems(newRecents);
                cachedRecentItems[tabType] = newRecents;
                setSelectedItem(null);
                show.updateShowStatus(item.id, false);
            }} />);
        }
        
        return actions;
    };

    const getChildrensForTab = (item: ItemData) => getChildrens(item, filteredShows);

    return {
        title: tabType === 'normal' ? 'Shows' : 'Banned Shows',
        selectedItem, setSelectedItem,
        recentItems,
        allItems,
        searchQuery: show.searchQuery,
        handleTogglePin: show.handleTogglePin,
        filteredShows,
        onCardClick,
        handleRename,
        getRenderActions,
        defaultIcon: DEFAULT_SHOW_ICON,
        getChildrens: getChildrensForTab,
        onItemClick: openEpisode
    };
};
