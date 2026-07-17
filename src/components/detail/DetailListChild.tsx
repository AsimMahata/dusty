import React from 'react';
import type { Item, ActionItem, EpisodeStatus } from '../../types/types';
import { ActionMenu } from '../ui/ActionMenu';
import { CheckCircle2, Circle, EyeOff } from 'lucide-react';

interface DetailListChildProps {
    child: Item;
    isSelected: boolean;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent, actions: ActionItem[]) => void;
    onActionClick?: (item: Item) => void | Promise<void>;
    onUpdateStatus?: (id: string, status: EpisodeStatus) => void;
    defaultIcon?: React.ReactNode;
    DEFAULT_ICON: React.ReactNode;
}

export const DetailListChild: React.FC<DetailListChildProps> = ({
    child,
    isSelected,
    onClick,
    onContextMenu,
    onActionClick,
    onUpdateStatus,
    defaultIcon,
    DEFAULT_ICON
}) => {
    const actions: ActionItem[] = [
        { label: 'Open', color: 'var(--accent)', onClick: () => onActionClick && onActionClick(child) },
    ];
    if (child.path) {
        actions.push({ label: 'Copy Path', onClick: () => navigator.clipboard.writeText(child.path!) });
    }
    if (child.title) {
        actions.push({ label: 'Copy File Name', onClick: () => navigator.clipboard.writeText(child.title) });
    }
    
    actions.push({ separator: true, label: '', onClick: () => {} });
    actions.push({ label: 'Mark as Watched', icon: <CheckCircle2 size={16} />, color: '#10b981', onClick: () => onUpdateStatus?.(child.id, 'watched') });
    actions.push({ label: 'Mark as Unwatched', icon: <EyeOff size={16} />, color: '#ef4444', onClick: () => onUpdateStatus?.(child.id, 'unwatched') });
    actions.push({ label: 'Mark as Default', icon: <Circle size={16} />, color: 'var(--text-muted)', onClick: () => onUpdateStatus?.(child.id, 'default') });

    const episodeStatus = (child as any).episode_status || 'default';

    return (
        <div
            className={`list-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            onContextMenu={(e) => onContextMenu(e, actions)}
        >
            <div className="list-item-icon">
                {child.icon || defaultIcon || DEFAULT_ICON}
            </div>

            <div className="list-item-content">
                <div className="list-item-title" style={{ display: 'flex', alignItems: 'center' }}>
                    {child.title}
                    {episodeStatus === 'watched' && <CheckCircle2 size={16} color="#10b981" style={{ marginLeft: 8 }} />}
                    {episodeStatus === 'unwatched' && <EyeOff size={16} color="#ef4444" style={{ marginLeft: 8 }} />}
                </div>
                <div className="list-item-subtitle">{child.subtitle}</div>
            </div>

            <div className="list-item-meta">
                {child.size}
            </div>

            <div className="list-item-actions" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', opacity: isSelected ? 1 : 0.6 }}>
                <ActionMenu actions={actions} />
            </div>
        </div>
    );
};
