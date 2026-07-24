import React from 'react';
import { SORT_DROPDOWN_ICON, SORT_ASC_ICON, SORT_DESC_ICON } from '../../constants/icons';
import { LABELS } from '../../constants/labels';
import { ContextMenu } from '../../../ui/ContextMenu';
import '../../css/MediaSources.css';
import type { MediaSortMethod } from "../../types/types";

interface MediaSourceSortBarProps {
    sortMethod: MediaSortMethod;
    sortAscending: boolean;
    onSortChange: (method: MediaSortMethod) => void;
    onDirectionToggle: () => void;
}

export const MediaSourceSortBar: React.FC<MediaSourceSortBarProps> = ({
    sortMethod,
    sortAscending,
    onSortChange,
    onDirectionToggle
}) => {
    const [menuPos, setMenuPos] = React.useState<{ x: number, y: number } | null>(null);

    const getSortLabel = () => {
        switch (sortMethod) {
            case 'title': return LABELS.SORT_TITLE;
            case 'updated': return LABELS.SORT_UPDATED;
            case 'random': return LABELS.SORT_RANDOM;
        }
    };

    return (
        <div className="media-sort-group">
            <button
                className="media-sort-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    if (menuPos) {
                        setMenuPos(null);
                    } else {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPos({ x: rect.left, y: rect.bottom + 4 });
                    }
                }}
            >
                <span style={{ color: 'var(--text-muted)' }}>Sort by:</span> {getSortLabel()} {SORT_DROPDOWN_ICON}
            </button>
            <button
                className="media-sort-btn icon-only"
                onClick={onDirectionToggle}
                disabled={sortMethod === 'random'}
                title={sortMethod === 'random' ? 'Cannot reverse random' : 'Reverse Order'}
            >
                {sortAscending ? SORT_ASC_ICON : SORT_DESC_ICON}
            </button>
            {menuPos && (
                <ContextMenu
                    x={menuPos.x}
                    y={menuPos.y}
                    actions={[
                        { label: LABELS.SORT_TITLE, onClick: () => { onSortChange('title'); setMenuPos(null); } },
                        { label: LABELS.SORT_UPDATED, onClick: () => { onSortChange('updated'); setMenuPos(null); } },
                        { label: LABELS.SORT_RANDOM, onClick: () => { onSortChange('random'); setMenuPos(null); } }
                    ]}
                    onClose={() => setMenuPos(null)}
                />
            )}
        </div>
    );
};
