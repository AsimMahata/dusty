import React from 'react';
import type { useMediaItemDetail } from '../../hooks/useMediaItemDetail';
import { MediaDetailListChild } from './MediaDetailListChild';
import type { Item } from "../../../../types/core";
import { DEFAULT_ICON } from '../../../../constants/icon';
import type { MediaType } from '../../types/types';

interface MediaDetailListProps {
    detail: ReturnType<typeof useMediaItemDetail>;
    onActionClick?: (item: Item) => void | Promise<void>;
    defaultIcon?: React.ReactNode;
    mediaType?: MediaType;
}

export const MediaDetailList: React.FC<MediaDetailListProps> = ({ detail, onActionClick, defaultIcon, mediaType }) => {

    const handleChildClick = (child: Item) => {
        if (detail.selectedChildId === child.id) {
            if (onActionClick) onActionClick(child);
        } else {
            detail.setSelectedChildId(child.id);
        }
    };

    return (
        <div className="list-container">
            {detail.loading ? (
                <div className="loading">Loading...</div>
            ) : (
                detail.childrens.map((child) => (
                    <MediaDetailListChild
                        key={child.id}
                        child={child}
                        isSelected={detail.selectedChildId === child.id}
                        onClick={() => handleChildClick(child)}
                        onContextMenu={detail.handleContextMenu}
                        onActionClick={onActionClick}
                        onUpdateStatus={detail.updateChildStatus}
                        defaultIcon={defaultIcon}
                        DEFAULT_ICON={DEFAULT_ICON}
                        mediaType={mediaType}
                    />
                ))
            )}
        </div>
    );
};
