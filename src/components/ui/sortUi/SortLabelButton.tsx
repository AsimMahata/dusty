import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Coordinates } from '../../../pages/shows/types/types';

interface SortLabelButtonProps {
    sortMenuPos: Coordinates | null;
    setSortMenuPos: (pos: Coordinates | null) => void;
    sortLabel: string;
}

export const SortLabelButton: React.FC<SortLabelButtonProps> = ({ sortMenuPos, setSortMenuPos, sortLabel }) => {
    return (
        <button
            className="show-sort-btn"
            onClick={(e) => {
                e.stopPropagation();
                if (sortMenuPos) {
                    setSortMenuPos(null);
                } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSortMenuPos({ x: rect.left, y: rect.bottom + 4 });
                }
            }}
        >
            <span style={{ color: 'var(--text-muted)' }}>Sort by:</span> {sortLabel} <ChevronDown size={14} />
        </button>
    );
};
