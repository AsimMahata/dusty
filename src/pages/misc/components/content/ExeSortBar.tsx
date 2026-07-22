import React from 'react';
import { SORT_OPTIONS } from '../../constants/constants';
import type { MiscSortMode } from '../../actions/sortChunks';

interface ExeSortBarProps {
    sortMode: MiscSortMode;
    onSortChange: (mode: MiscSortMode) => void;
}

export const ExeSortBar: React.FC<ExeSortBarProps> = ({ sortMode, onSortChange }) => {
    return (
        <div className="zip-sort-bar" style={{ marginBottom: '12px' }}>
            {SORT_OPTIONS.map(opt => (
                <button
                    key={opt.mode}
                    className={`zip-sort-btn ${sortMode === opt.mode ? 'active' : ''}`}
                    onClick={() => onSortChange(opt.mode)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
