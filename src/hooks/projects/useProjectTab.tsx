import React, { useState } from 'react';
import { ACTIONS_SEPARATOR, PIN_COLOR, ITEM_STATUS_COLORS } from '../../constants/color';
import { PIN_ICON_16, EYE_ICON_16, CHECK_CIRCLE_ICON_16, PAUSE_CIRCLE_ICON_16, X_CIRCLE_ICON_16, ROTATE_CCW_ICON_16 } from '../../constants/icon';
import type { ActionItem, ItemCollection, ProjectStatus } from '../../types/types';
import type { useProject } from './useProject';
import { TITLE_PROJECTS } from '../../constants/tabs';
import { DEFAULT_PROJECT_ICON } from '../../constants/defaults';
import { LABELS } from '../../constants/labels';

const PROJECT_STATUS_PRIORITY: Record<ProjectStatus, number> = {
    working: 0,
    completed: 1,
    default: 2,
    on_hold: 3,
    dropped: 4,
};

let cachedRecentItems: ItemCollection[] = [];

export const useProjectTab = (project: ReturnType<typeof useProject>) => {
    const [recentItems, setRecentItems] = useState<ItemCollection[]>(cachedRecentItems);

    const allItems: ItemCollection[] = project.allProjects.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: `Type: ${p.project_type}`,
        icon: DEFAULT_PROJECT_ICON,
        path: p.path,
        is_dir: true,
        is_pinned: p.pinned || false,
        status: p.status || 'default'
    })).sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        const statusA = a.status || 'default';
        const statusB = b.status || 'default';

        if (PROJECT_STATUS_PRIORITY[statusA] !== PROJECT_STATUS_PRIORITY[statusB]) {
            return PROJECT_STATUS_PRIORITY[statusA] - PROJECT_STATUS_PRIORITY[statusB];
        }

        return a.title.localeCompare(b.title, undefined, { numeric: true });
    });

    const onCardClick = (item: ItemCollection) => {
        const recents = recentItems.filter(x => x.id !== item.id);
        const newRecents = [item, ...recents].slice(0, 3);
        setRecentItems(newRecents);
        cachedRecentItems = newRecents;
        project.setSelectedItem(item);
    };

    const getRenderActions = (_item: ItemCollection): React.ReactNode[] => {
        const actions: React.ReactNode[] = [];
        actions.push(...project.getCommonRenderedActions());
        return actions;
    };

    const getCardActions = (item: ItemCollection): ActionItem[] => {
        const actions: ActionItem[] = [];

        actions.push({
            label: item.is_pinned ? LABELS.UNPIN : LABELS.PIN,
            icon: PIN_ICON_16,
            color: PIN_COLOR,
            onClick: () => project.handleTogglePin(item.id)
        });

        actions.push(ACTIONS_SEPARATOR);

        const updateStatus = (status: ProjectStatus) => {
            void project.updateProjectProgressStatus(item.id, status);
        };

        actions.push({ label: LABELS.MARK_WORKING, icon: EYE_ICON_16, color: ITEM_STATUS_COLORS.working, onClick: () => updateStatus('working') });
        actions.push({ label: LABELS.MARK_COMPLETED, icon: CHECK_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.completed, onClick: () => updateStatus('completed') });
        actions.push({ label: LABELS.MARK_ON_HOLD, icon: PAUSE_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.on_hold, onClick: () => updateStatus('on_hold') });
        actions.push({ label: LABELS.MARK_DROPPED, icon: X_CIRCLE_ICON_16, color: ITEM_STATUS_COLORS.dropped, onClick: () => updateStatus('dropped') });
        actions.push({ label: LABELS.MARK_DEFAULT, icon: ROTATE_CCW_ICON_16, color: ITEM_STATUS_COLORS.default, onClick: () => updateStatus('default') });

        return actions;
    };

    return {
        title: TITLE_PROJECTS,
        recentItems,
        allItems,
        searchQuery: project.searchQuery,
        onCardClick,
        isRefreshing: project.isRefreshing,
        handleTogglePin: project.handleTogglePin,
        getRenderActions,
        getCardActions,
        defaultIcon: DEFAULT_PROJECT_ICON
    };
};
