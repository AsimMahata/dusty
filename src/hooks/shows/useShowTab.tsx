import React, { useState, useEffect } from 'react';
import type { ItemCollection, TabType } from '../../types/types';
import type { useShow } from './useShow';
import { getChildrens, openEpisode } from '../../pages/shows/actions/utility';
import { TITLE_SHOWS, TITLE_BANNED, TYPE_NORMAL, TYPE_BANNED } from '../../constants/tabs';
import { DEFAULT_SHOW_ICON, DEFAULT_TV_ICON } from '../../constants/defaults';
import { SHOW_STATUS_PRIORITY } from '../../constants/priority';

let cachedRecentItems: Partial<Record<TabType, ItemCollection[]>> = {
    [TYPE_NORMAL]: [],
    [TYPE_BANNED]: [],
};

export const useShowTab = (show: ReturnType<typeof useShow>, tabType: TabType) => {
    const [selectedItem, setSelectedItem] = useState<ItemCollection | null>(null);
    const [recentItems, setRecentItems] = useState<ItemCollection[]>(cachedRecentItems[tabType] ?? []);

    const banned = tabType === TYPE_BANNED;
    const filteredShows = show.allShows.filter(s => s.banned === banned);

    const allItems: ItemCollection[] = filteredShows.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: `Found ${s.num_episodes} episodes`,
        icon: DEFAULT_TV_ICON,
        path: s.dir,
        is_dir: false,
        is_pinned: s.pinned || false,
        status: s.status || 'default'
    })).sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        const statusA = a.status || 'default';
        const statusB = b.status || 'default';

        if (SHOW_STATUS_PRIORITY[statusA] !== SHOW_STATUS_PRIORITY[statusB]) {
            return SHOW_STATUS_PRIORITY[statusA] - SHOW_STATUS_PRIORITY[statusB];
        }

        return a.title.localeCompare(b.title, undefined, { numeric: true });
    });

    useEffect(() => {
        show.setIsItemSelected(!!selectedItem);
    }, [selectedItem, show.setIsItemSelected]);

    const onCardClick = (item: ItemCollection) => {
        const recents = recentItems.filter(x => x.id !== item.id);
        const newRecents = [item, ...recents].slice(0, 3);
        setRecentItems(newRecents);
        cachedRecentItems[tabType] = newRecents;
        setSelectedItem(item);
    };

    const handleRename = async (item: ItemCollection, newTitle: string) => {
        await show.updateShowTitle(item.id, newTitle);
        setSelectedItem({ ...item, title: newTitle });
        const newRecents = recentItems.map(x => x.id === item.id ? { ...x, title: newTitle } : x);
        setRecentItems(newRecents);
        cachedRecentItems[tabType] = newRecents;
    };

    const getRenderActions = (_item: ItemCollection): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        actions.push(...show.getCommonRenderedActions());
        return actions;
    };
    const getChildrensForTab = (item: ItemCollection) => getChildrens(item, filteredShows);

    return {
        title: tabType === TYPE_NORMAL ? TITLE_SHOWS : TITLE_BANNED,
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
