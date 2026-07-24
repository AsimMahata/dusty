import React from 'react';
import { ZIP_TITLE, ZIP_EMPTY_DESC } from '../../constants/constants';
import { ZipSortBar } from './ZipSortBar';
import type { MiscSortMode } from "../../../misc/types/types";

interface ZipHeaderProps {
    count: number;
    sortMode: MiscSortMode;
    onSortChange: (mode: MiscSortMode) => void;
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
