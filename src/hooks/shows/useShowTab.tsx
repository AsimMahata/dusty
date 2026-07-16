import React, { useState, useEffect } from 'react';
import type { ItemCollection, ActionItem, ShowStatus, TabType } from '../../types/types';
import type { useShow } from './useShow';
import { getChildrens, openEpisode } from '../../pages/shows/utility';
import { TITLE_SHOWS, TITLE_BANNED, TYPE_NORMAL, TYPE_BANNED } from '../../constants/tabs';
import { PIN_ICON_16, EYE_ICON_16, CHECK_CIRCLE_ICON_16, CALENDAR_ICON_16, PAUSE_CIRCLE_ICON_16, X_CIRCLE_ICON_16, ROTATE_CCW_ICON_16, BAN_ICON_16, SHIELD_CHECK_ICON_16 } from '../../constants/icon';
import { ACTIONS_SEPARATOR, PIN_COLOR, ITEM_STATUS_COLORS, COLOR_ROSE_900 } from '../../constants/color';
import { DEFAULT_SHOW_ICON, DEFAULT_TV_ICON } from '../../constants/defaults';
import { SHOW_STATUS_PRIORITY } from '../../constants/priority';
import { LABELS } from '../../constants/labels';

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

    const getCardActions = (item: ItemCollection): ActionItem[] => {

        const actions: ActionItem[] = [];

        actions.push({
            label: item.is_pinned ? LABELS.UNPIN : LABELS.PIN,
            icon: PIN_ICON_16,
            color: PIN_COLOR,
            onClick: () => show.handleTogglePin(item.id)
        });

        actions.push(ACTIONS_SEPARATOR);

        const updateStatus = (status: ShowStatus) => {
            void show.updateShowVisualStatus(item.id, status);
        };

        actions.push({ label: LABELS.MARK_WATCHING, icon: EYE_ICON_16, color: ITEM_STATUS_COLORS.watching, onClick: () => updateStatus('watching') });
        actions.push({ label: LABELS.MARK_COMPLETED, icon: CHECK_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.completed, onClick: () => updateStatus('completed') });
        actions.push({ label: LABELS.MARK_PLANNED, icon: CALENDAR_ICON_16, color: ITEM_STATUS_COLORS.planned, onClick: () => updateStatus('planned') });
        actions.push({ label: LABELS.MARK_ON_HOLD, icon: PAUSE_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.on_hold, onClick: () => updateStatus('on_hold') });
        actions.push({ label: LABELS.MARK_DROPPED, icon: X_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.dropped, onClick: () => updateStatus('dropped') });
        actions.push({ label: LABELS.MARK_DEFAULT, icon: ROTATE_CCW_ICON_16, color: 'var(--text-muted)', onClick: () => updateStatus('default') });

        actions.push(ACTIONS_SEPARATOR);

        if (tabType === TYPE_NORMAL) {
            actions.push({
                label: LABELS.BAN_SHOW,
                icon: BAN_ICON_16,
                color: COLOR_ROSE_900,
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
                label: LABELS.UNBAN_SHOW,
                icon: SHIELD_CHECK_ICON_16,
                color: COLOR_ROSE_900,
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
        getCardActions,
        defaultIcon: DEFAULT_SHOW_ICON,
        getChildrens: getChildrensForTab,
        onItemClick: openEpisode
    };
};
