import React, { useState, useEffect } from 'react';
import type { ItemCollection, ActionItem, ShowStatus } from '../../types/types';
import { Eye, CheckCircle, Calendar, PauseCircle, XCircle, RotateCcw, Ban, ShieldCheck } from 'lucide-react';

const SHOW_STATUS_PRIORITY: Record<ShowStatus, number> = {
    watching: 0,
    default: 1,
    planned: 2,
    on_hold: 3,
    dropped: 4,
    completed: 5,
};
import type { useShow } from './useShow';
import { useDefaults } from '../../contexts/defaultContext';
import { getChildrens, openEpisode } from '../../pages/shows/utility';
import { PIN_ICON_16 } from '../../constants/icon';
import { ACTIONS_SEPARATOR, PIN_COLOR } from '../../constants/color';

let cachedRecentItems: Record<'normal' | 'banned', ItemCollection[]> = {
    normal: [],
    banned: []
};

export const useShowTab = (show: ReturnType<typeof useShow>, tabType: 'normal' | 'banned') => {
    const { DEFAULT_TV_ICON, DEFAULT_SHOW_ICON } = useDefaults();
    const [selectedItem, setSelectedItem] = useState<ItemCollection | null>(null);
    const [recentItems, setRecentItems] = useState<ItemCollection[]>(cachedRecentItems[tabType]);

    const isBanned = tabType === 'banned';
    const filteredShows = show.allShows.filter(s => s.is_banned === isBanned);

    const allItems: ItemCollection[] = filteredShows.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: `Found ${s.num_episodes} episodes`,
        icon: DEFAULT_TV_ICON,
        path: s.dir,
        is_dir: false,
        is_pinned: s.pinnned || false,
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

    const getCardActions = (item: ItemCollection): ActionItem[] => {

        const actions: ActionItem[] = [];

        actions.push({
            label: item.is_pinned ? 'Unpin' : 'Pin',
            icon: PIN_ICON_16,
            color: PIN_COLOR,
            onClick: () => show.handleTogglePin(item.id)
        });

        actions.push(ACTIONS_SEPARATOR);

        const updateStatus = (status: ShowStatus) => {
            void show.updateShowVisualStatus(item.id, status);
        };

        actions.push({ label: 'Mark as Watching', icon: <Eye size={16} />, color: '#10b981', onClick: () => updateStatus('watching') });
        actions.push({ label: 'Mark as Completed', icon: <CheckCircle size={16} />, color: '#3b82f6', onClick: () => updateStatus('completed') });
        actions.push({ label: 'Mark as Planned', icon: <Calendar size={16} />, color: '#a855f7', onClick: () => updateStatus('planned') });
        actions.push({ label: 'Mark as On Hold', icon: <PauseCircle size={16} />, color: '#f97316', onClick: () => updateStatus('on_hold') });
        actions.push({ label: 'Mark as Dropped', icon: <XCircle size={16} />, color: '#ef4444', onClick: () => updateStatus('dropped') });
        actions.push({ label: 'Mark as Default', icon: <RotateCcw size={16} />, color: 'var(--text-muted)', onClick: () => updateStatus('default') });

        actions.push(ACTIONS_SEPARATOR);

        if (tabType === 'normal') {
            actions.push({
                label: 'Ban Show',
                icon: <Ban size={16} />,
                color: '#9f1239', // Maroon/Rose-900
                onClick: () => {
                    const newRecents = recentItems.filter(x => x.id !== item.id);
                    setRecentItems(newRecents);
                    cachedRecentItems[tabType] = newRecents;
                    if (selectedItem?.id === item.id) setSelectedItem(null);
                    show.updateShowStatus(item.id, true);
                }
            });
        } else {
            actions.push({
                label: 'Unban Show',
                icon: <ShieldCheck size={16} />,
                color: '#9f1239', // Maroon/Rose-900
                onClick: () => {
                    const newRecents = recentItems.filter(x => x.id !== item.id);
                    setRecentItems(newRecents);
                    cachedRecentItems[tabType] = newRecents;
                    if (selectedItem?.id === item.id) setSelectedItem(null);
                    show.updateShowStatus(item.id, false);
                }
            });
        }

        return actions;
    };

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
        getCardActions,
        defaultIcon: DEFAULT_SHOW_ICON,
        getChildrens: getChildrensForTab,
        onItemClick: openEpisode
    };
};
