import React from 'react';
import { PDF_TITLE, PDF_EMPTY_DESC } from '../../constants/constants';
import { PdfSortBar } from './PdfSortBar';
import type { PdfSortMode } from "../../../../types/pdf";

interface PdfHeaderProps {
    count: number;
    sortMode: PdfSortMode;
    onSortChange: (mode: PdfSortMode) => void;
}

export const PdfHeader: React.FC<PdfHeaderProps> = ({ count, sortMode, onSortChange }) => {
    return (
        <div className="bazar-page-header">
            <div className="bazar-page-header-text">
                <h2 className="bazar-page-title">{PDF_TITLE}</h2>
                <p className="bazar-page-subtitle">
                    {count > 0
                        ? `Showing ${count} PDF ${count === 1 ? 'document' : 'documents'}`
                        : PDF_EMPTY_DESC}
                </p>
            </div>
            <PdfSortBar sortMode={sortMode} onSortChange={onSortChange} />
        </div>
    );
};
