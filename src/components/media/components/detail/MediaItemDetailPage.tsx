import React from 'react';
import { ContextMenu } from '../../../ui/ContextMenu';
import { useMediaItemDetail } from '../../hooks/useMediaItemDetail';
import { MediaDetailHeader } from './MediaDetailHeader';
import { MediaDetailList } from './MediaDetailList';
import type { BaseItem, AnyItem, Item, ActionItem } from "../../../../types/core";
import type { MediaType } from '../../types/types';

export interface MediaItemDetailPageProps<T extends BaseItem = AnyItem> {
    tab: {
        selectedItem?: T | null;
        setSelectedItem?: (item: T | null) => void;
        onItemClick?: (item: Item) => void | Promise<void>;
        getRenderActions?: (item: T) => React.ReactNode;
        defaultIcon?: React.ReactNode;
        handleRename?: (item: T, newTitle: string) => Promise<void>;
        getChildrens?: (item: T) => Promise<Item[]>;
        getCardActions?: (item: T) => ActionItem[];
    };
    mediaType?: MediaType;
}

export function MediaItemDetailPage<T extends BaseItem>({ tab, mediaType }: MediaItemDetailPageProps<T>) {
    const item = tab.selectedItem;
    const onBack = () => tab.setSelectedItem?.(null);
    const onClick = tab.onItemClick;
    const renderActions = tab.getRenderActions;
    const defaultIcon = tab.defaultIcon;
    const onRename = tab.handleRename;

    const detail = useMediaItemDetail(tab, mediaType);

    if (!item) return null;

    return (
        <div className="detail-page">
            <MediaDetailHeader 
                item={item}
                detail={detail}
                onBack={onBack}
                canRename={!!onRename}
                actions={tab.getCardActions ? tab.getCardActions(item) : undefined}
                mediaType={mediaType}
            />

            {renderActions && (
                <div className="detail-actions" style={{ padding: '0 1.5rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {renderActions(item)}
                </div>
            )}

            <MediaDetailList 
                detail={detail}
                onActionClick={onClick}
                defaultIcon={defaultIcon}
                mediaType={mediaType}
            />

            {detail.contextMenu && (
                <ContextMenu
                    x={detail.contextMenu.x}
                    y={detail.contextMenu.y}
                    actions={detail.contextMenu.actions}
                    onClose={() => detail.setContextMenu(null)}
                />
            )}
        </div>
    );
};
