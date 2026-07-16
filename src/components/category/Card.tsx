import React from 'react';
import { ActionMenu } from '../ui/ActionMenu';
import type { ItemStatus, ActionItem } from '../../types/types';
import { ITEM_STATUS_COLORS } from '../../constants/color';

interface CardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    metadata?: string;
    size?: string;
    isSelected?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    isPinned?: boolean;
    onTogglePin?: (e: React.MouseEvent) => void;
    status?: ItemStatus;
    accentColor?: string;
    actions?: ActionItem[];
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon, metadata, size, isSelected, onClick, onDoubleClick, isPinned, status, accentColor, actions }) => {
    const resolvedAccentColor = accentColor || (status && status !== 'default' ? ITEM_STATUS_COLORS[status] : undefined);

    return (
        <div
            className={`item-card ${isSelected ? 'selected' : ''} ${isPinned ? 'pinned' : ''}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={resolvedAccentColor ? { '--accent': resolvedAccentColor, userSelect: 'none' } as React.CSSProperties : { userSelect: 'none' }}
        >
            {
                actions && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2 }}>
                        <ActionMenu actions={actions} />
                    </div>
                )
            }
            <div className="card-icon-wrap">
                {icon}
            </div>
            <div className="card-content">
                <div className="card-title">
                    {title}
                    {isPinned && <span className="card-pin-dot" title="Pinned" />}
                </div>
                <div className="card-subtitle">{subtitle}</div>
                {(metadata || size) && (
                    <div className="card-meta">
                        {metadata && (
                            <span className="meta-item">
                                <span>•</span> {metadata}
                            </span>
                        )}
                        {size && (
                            <span className="meta-item">
                                <span>•</span> {size}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
