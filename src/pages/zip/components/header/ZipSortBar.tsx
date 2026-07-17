import React from 'react';
import { SORT_OPTIONS, type ZipSortMode } from '../../constants/constants';

interface ZipSortBarProps {
    sortMode: ZipSortMode;
    onSortChange: (mode: ZipSortMode) => void;
}

export const ZipSortBar: React.FC<ZipSortBarProps> = ({ sortMode, onSortChange }) => {
    return (
        <div className="zip-sort-bar">
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
