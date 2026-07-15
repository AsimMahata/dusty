import { useState, useEffect } from 'react';
import type { ItemData, TabHook } from '../types/types';
import type { ContextMenuAction } from '../components/ui/ContextMenu';

export const useItemDetail = (tab: TabHook) => {
    const item = tab.selectedItem;
    const getChildrens = tab.getChildrens;
    const onRename = tab.handleRename;

    const [childrens, setChildrens] = useState<ItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, actions: ContextMenuAction[] } | null>(null);

    const handleContextMenu = (e: React.MouseEvent, actions: ContextMenuAction[]) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, actions });
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
        handleConfirmEdit
    };
};
