import React from 'react';
import type { Item } from '../../types/types';
import type { useItemDetail } from '../../hooks/useItemDetail';
import { DetailListChild } from './DetailListChild';
import { DEFAULT_ICON } from '../../constants/defaults';

interface DetailListProps {
    detail: ReturnType<typeof useItemDetail<any>>;
    onActionClick?: (item: Item) => void | Promise<void>;
    defaultIcon?: React.ReactNode;
}

export const DetailList: React.FC<DetailListProps> = ({ detail, onActionClick, defaultIcon }) => {

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
                    <DetailListChild
                        key={child.id}
                        child={child}
                        isSelected={detail.selectedChildId === child.id}
                        onClick={() => handleChildClick(child)}
                        onContextMenu={detail.handleContextMenu}
                        onActionClick={onActionClick}
                        onUpdateStatus={detail.updateChildStatus}
                        defaultIcon={defaultIcon}
                        DEFAULT_ICON={DEFAULT_ICON}
                    />
                ))
            )}
        </div>
    );
};
