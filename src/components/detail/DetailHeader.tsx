import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { EditTitle } from './EditTitle';
import { DetailTitle } from './DetailTitle';
import type { ItemData } from '../../types/types';
import type { useItemDetail } from '../../hooks/useItemDetail';

interface DetailHeaderProps {
    item: ItemData;
    detail: ReturnType<typeof useItemDetail>;
    onBack: () => void;
    canRename: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ item, detail, onBack, canRename }) => {
    return (
        <div className="detail-header">
            <button className="back-btn" onClick={onBack} title="Go back">
                <ArrowLeft size={20} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {detail.isEditing ? (
                    <EditTitle
                        value={detail.editValue}
                        onChange={detail.setEditValue}
                        onConfirm={detail.handleConfirmEdit}
                        onCancel={detail.handleCancelEdit}
                        disabled={detail.isRenaming}
                    />
                ) : (
                    <DetailTitle 
                        title={item.title}
                        onEditClick={detail.handleEditClick}
                        canRename={canRename}
                    />
                )}
                <div className="detail-subtitle">
                    {item.subtitle} {item.metadata && `• ${item.metadata}`}
                </div>
            </div>
            {!detail.loading && (
                <span style={{ marginLeft: 'auto', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                    {detail.childrens.length}
                </span>
            )}
        </div>
    );
};
