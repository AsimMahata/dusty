import { useState, useEffect } from 'react';
import type { BaseItem, AnyItem, Item, TabHook, ActionItem, EpisodeStatus } from '../types/types';

export function useItemDetail<T extends BaseItem = AnyItem>(tab: TabHook<T>) {
    const item = tab.selectedItem;
    const getChildrens = tab.getChildrens;
    const onRename = tab.handleRename;

    const [childrens, setChildrens] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, actions: ActionItem[] } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, actions: ActionItem[]) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, actions });
    };

    const updateChildStatus = (id: string, status: EpisodeStatus) => {
        setChildrens(prev => prev.map(c => c.id === id ? { ...c, episode_status: status } : c));
    };

    const updateAllChildrenStatus = (status: EpisodeStatus) => {
        setChildrens(prev => prev.map(c => ({ ...c, episode_status: status })));
    };

    const handleEditClick = () => {
        if (!item) return;
        setEditValue(item.title);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleConfirmEdit = async () => {
        if (!item || !editValue || editValue === item.title) {
            setIsEditing(false);
            return;
        }

        if (onRename) {
            setIsRenaming(true);
            try {
                await onRename(item, editValue);
            } finally {
                setIsRenaming(false);
                setIsEditing(false);
            }
        }
    };

    useEffect(() => {
        if (!item) return;
        
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            const data = getChildrens ? await getChildrens(item) : [];
            if (!cancelled) {
                setChildrens(data);
                setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [item, getChildrens]);

    return {
        childrens,
        loading,
        isEditing,
        editValue,
        setEditValue,
        isRenaming,
        selectedChildId,
        setSelectedChildId,
        contextMenu,
        setContextMenu,
        handleContextMenu,
        handleEditClick,
        handleCancelEdit,
        handleConfirmEdit,
        updateChildStatus,
        updateAllChildrenStatus
    };
}
