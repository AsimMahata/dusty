import React from 'react';
import { ActionMenu } from '../../../ui/ActionMenu';
import { CHECK_CIRCLE_2_ICON_16, EYE_OFF_ICON_16, CIRCLE_ICON_16, CHECK_CIRCLE_2_ICON_16_WATCHED, EYE_OFF_ICON_16_UNWATCHED } from '../../../../constants/icon';
import type { Item, ActionItem } from "../../../../types/core";
import type { EpisodeStatus, MediaType } from "../../types/types";
import { COLORS } from '../../../../constants/color';

interface MediaDetailListChildProps {
    child: Item;
    isSelected: boolean;
    onClick: () => void;
    onContextMenu: (e: React.MouseEvent, actions: ActionItem[]) => void;
    onActionClick?: (item: Item) => void | Promise<void>;
    onUpdateStatus?: (id: string, status: EpisodeStatus) => void;
    defaultIcon?: React.ReactNode;
    DEFAULT_ICON: React.ReactNode;
    mediaType?: MediaType;
}

export const MediaDetailListChild: React.FC<MediaDetailListChildProps> = ({
    child,
    isSelected,
    onClick,
    onContextMenu,
    onActionClick,
    onUpdateStatus,
    defaultIcon,
    DEFAULT_ICON,
    mediaType
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

    if (mediaType === 'video') {
        actions.push({ separator: true, label: '', onClick: () => { } });
        actions.push({ label: 'Mark as Watched', icon: CHECK_CIRCLE_2_ICON_16, color: COLORS.MEDIA.WATCHED, onClick: () => onUpdateStatus?.(child.id, 'watched') });
        actions.push({ label: 'Mark as Unwatched', icon: EYE_OFF_ICON_16, color: COLORS.MEDIA.UNWATCHED, onClick: () => onUpdateStatus?.(child.id, 'unwatched') });
        actions.push({ label: 'Mark as Default', icon: CIRCLE_ICON_16, color: 'var(--text-muted)', onClick: () => onUpdateStatus?.(child.id, 'default') });
    }

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
                    {mediaType === 'video' && episodeStatus === 'watched' && CHECK_CIRCLE_2_ICON_16_WATCHED}
                    {mediaType === 'video' && episodeStatus === 'unwatched' && EYE_OFF_ICON_16_UNWATCHED}
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
