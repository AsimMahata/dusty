import React from 'react';
import { ARROW_LEFT_ICON_20, CHECK_SQUARE_ICON_20, CHECK_CIRCLE_2_ICON_16, EYE_OFF_ICON_16, CIRCLE_ICON_16 } from '../../../../constants/icon';
import { ActionMenu } from '../../../ui/ActionMenu';
import { MediaEditTitle } from './MediaEditTitle';
import { MediaDetailTitle } from './MediaDetailTitle';

import type { useMediaItemDetail } from '../../hooks/useMediaItemDetail';
import { COLORS } from '../../../../constants/color';
import type { ActionItem, AnyItem, ItemCollection } from "../../../../types/core";
import type { MediaType } from '../../types/types';

interface MediaDetailHeaderProps {
    item: AnyItem;
    detail: ReturnType<typeof useMediaItemDetail>;
    onBack: () => void;
    canRename: boolean;
    actions?: ActionItem[];
    mediaType?: MediaType;
}

export const MediaDetailHeader: React.FC<MediaDetailHeaderProps> = ({ item, detail, onBack, canRename, actions, mediaType }) => {
    return (
        <div className="detail-header">
            <button className="back-btn" onClick={onBack} title="Go back">
                {ARROW_LEFT_ICON_20}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {detail.isEditing ? (
                    <MediaEditTitle
                        value={detail.editValue}
                        onChange={detail.setEditValue}
                        onConfirm={detail.handleConfirmEdit}
                        onCancel={detail.handleCancelEdit}
                        disabled={detail.isRenaming}
                    />
                ) : (
                    <MediaDetailTitle
                        title={item.title}
                        onEditClick={detail.handleEditClick}
                        canRename={canRename}
                        color={(item as Partial<ItemCollection>).status && (item as Partial<ItemCollection>).status !== 'default' ? COLORS.STATUS.ITEM[(item as Partial<ItemCollection>).status!] : undefined}
                    />
                )}
                <div className="detail-subtitle">
                    {item.subtitle} {item.metadata && `• ${item.metadata}`}
                </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {(item as Partial<ItemCollection>).status && (item as Partial<ItemCollection>).status !== 'default' && (
                    <div style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        border: `1px solid ${COLORS.STATUS.ITEM[(item as Partial<ItemCollection>).status!]}`,
                        color: COLORS.STATUS.ITEM[(item as Partial<ItemCollection>).status!],
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginRight: '0.5rem'
                    }}>
                        {(item as Partial<ItemCollection>).status!.replace('_', ' ')}
                    </div>
                )}
                {!detail.loading && (
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal', marginRight: actions && actions.length > 0 ? '0.5rem' : '0' }}>
                        {detail.childrens.length}
                    </span>
                )}
                {actions && actions.length > 0 && (
                    <ActionMenu actions={actions} />
                )}
                {mediaType === 'video' && !detail.loading && detail.childrens.length > 0 && (
                    <ActionMenu
                        icon={CHECK_SQUARE_ICON_20}
                        actions={[
                            { label: 'Mark All Watched', icon: CHECK_CIRCLE_2_ICON_16, color: COLORS.MEDIA.WATCHED, onClick: () => detail.updateAllChildrenStatus('watched') },
                            { label: 'Mark All Unwatched', icon: EYE_OFF_ICON_16, color: COLORS.MEDIA.UNWATCHED, onClick: () => detail.updateAllChildrenStatus('unwatched') },
                            { label: 'Reset All Statuses', icon: CIRCLE_ICON_16, color: 'var(--text-muted)', onClick: () => detail.updateAllChildrenStatus('default') }
                        ]}
                    />
                )}
            </div>
        </div>
    );
};
