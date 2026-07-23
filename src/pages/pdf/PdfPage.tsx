import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { usePdf } from '../../hooks/pdf/usePdf';
import { PdfHeader } from './components/header/PdfHeader';
import { PdfTabContent } from './components/tab/PdfTabContent';
import type { PdfSortMode } from "../../types/pdf";
import { getSortModePdfPage, getDefaultSortMode, setSortModePdfPage } from '../../session/pdf/sort';

export const PdfPage: React.FC = () => {
    const pdf = usePdf();
    const count = pdf.chunks.length;
    const [sortMode, setSortModeState] = useState<PdfSortMode>(getDefaultSortMode());

    async function fetchSessionData() {
        try {
            const mode = await getSortModePdfPage();
            setSortModeState(mode);
        } catch (e) {}
    }

    useEffect(() => {
        fetchSessionData();
    }, []);

    const setSortMode = (mode: PdfSortMode) => {
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
