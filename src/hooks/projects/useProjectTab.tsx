import React, { useState } from 'react';
import { ACTIONS_SEPARATOR, PIN_COLOR } from '../../constants/color';
import { PIN_ICON_16 } from '../../constants/icon';
import type { ActionItem, ItemCollection, ProjectStatus } from '../../types/types';
import type { useProject } from './useProject';
import { Eye, CheckCircle, PauseCircle, XCircle, RotateCcw } from 'lucide-react';
import { DEFAULT_PROJECT_ICON } from '../../constants/defaults';

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
            label: item.is_pinned ? 'Unpin' : 'Pin',
            icon: PIN_ICON_16,
            color: PIN_COLOR,
            onClick: () => project.handleTogglePin(item.id)
        });

        actions.push(ACTIONS_SEPARATOR);

        const updateStatus = (status: ProjectStatus) => {
            void project.updateProjectProgressStatus(item.id, status);
        };

        actions.push({ label: 'Mark as Working', icon: <Eye size={16} />, color: '#10b981', onClick: () => updateStatus('working') });
        actions.push({ label: 'Mark as Completed', icon: <CheckCircle size={16} />, color: '#3b82f6', onClick: () => updateStatus('completed') });
        actions.push({ label: 'Mark as On Hold', icon: <PauseCircle size={16} />, color: '#f97316', onClick: () => updateStatus('on_hold') });
        actions.push({ label: 'Mark as Dropped', icon: <XCircle size={16} />, color: '#ef4444', onClick: () => updateStatus('dropped') });
        actions.push({ label: 'Mark as Default', icon: <RotateCcw size={16} />, color: 'var(--text-muted)', onClick: () => updateStatus('default') });

        return actions;
    };

    return {
        title: "Projects",
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
