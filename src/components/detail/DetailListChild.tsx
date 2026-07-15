import React from 'react';
import type { ItemData } from '../../types/types';
import type { ContextMenuAction } from '../ui/ContextMenu';

interface DetailListChildProps {
    child: ItemData;
    isSelected: boolean;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent, actions: ContextMenuAction[]) => void;
    onActionClick?: (item: ItemData) => void | Promise<void>;
    defaultIcon?: React.ReactNode;
    DEFAULT_ICON: React.ReactNode;
}

export const DetailListChild: React.FC<DetailListChildProps> = ({
    child,
    isSelected,
    onClick,
    onContextMenu,
    onActionClick,
    defaultIcon,
    DEFAULT_ICON
}) => {
    return (
        <div
            className={`list-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            onContextMenu={(e) => {
                const actions: ContextMenuAction[] = [
                    { label: 'Open', onClick: () => onActionClick && onActionClick(child) },
                ];
                if (child.path) {
                    actions.push({ label: 'Copy Path', onClick: () => navigator.clipboard.writeText(child.path!) });
                }
                if (child.title) {
                    actions.push({ label: 'Copy File Name', onClick: () => navigator.clipboard.writeText(child.title) });
                }
                onContextMenu(e, actions);
            }}
        >
            <div className="list-item-icon">
                {child.icon || defaultIcon || DEFAULT_ICON}
            </div>

            <div className="list-item-content">
                <div className="list-item-title">{child.title}</div>
                <div className="list-item-subtitle">{child.subtitle}</div>
            </div>

            <div className="list-item-meta">
                {child.size}
            </div>
        </div>
    );
};
