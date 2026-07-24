import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { PdfHeader } from './components/header/PdfHeader';
import { PdfTabContent } from './components/tab/PdfTabContent';
import { usePdf } from './hooks/usePdf';
import { getDefaultSortMode, getSortModePdfPage, setSortModePdfPage } from './session/sort';
import type { MiscSortMode } from "../misc/types/types";

export const PdfPage: React.FC = () => {
    const pdf = usePdf();
    const count = pdf.chunks.length;
    const [sortMode, setSortModeState] = useState<MiscSortMode>(getDefaultSortMode());

    async function fetchSessionData() {
        try {
            const mode = await getSortModePdfPage();
            setSortModeState(mode);
        } catch (e) { }
    }

    useEffect(() => {
        fetchSessionData();
    }, []);

    const setSortMode = (mode: MiscSortMode) => {
        setSortModeState(mode);
        void setSortModePdfPage(mode);
    };

    return (
        <PageLayout hook={pdf}>
            <PdfHeader
                count={count}
                sortMode={sortMode}
                onSortChange={setSortMode}
            />
            <div className="tab-content">
                <PdfTabContent pdf={pdf} sortMode={sortMode} />
            </div>
        </PageLayout>
    );
};
