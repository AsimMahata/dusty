import React from 'react';
import { ZIP_TITLE, ZIP_EMPTY_DESC, type ZipSortMode } from '../../constants/constants';
import { ZipSortBar } from './ZipSortBar';

interface ZipHeaderProps {
    count: number;
    sortMode: ZipSortMode;
    onSortChange: (mode: ZipSortMode) => void;
}

export const ZipHeader: React.FC<ZipHeaderProps> = ({ count, sortMode, onSortChange }) => {
    return (
        <div className="bazar-page-header">
            <div className="bazar-page-header-text">
                <h2 className="bazar-page-title">{ZIP_TITLE}</h2>
                <p className="bazar-page-subtitle">
                    {count > 0
                        ? `Showing ${count} compressed ${count === 1 ? 'archive' : 'archives'}`
                        : ZIP_EMPTY_DESC}
                </p>
            </div>
            <ZipSortBar sortMode={sortMode} onSortChange={onSortChange} />
        </div>
    );
};
