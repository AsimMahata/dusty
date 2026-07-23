import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useZip } from '../../hooks/zip/useZip';
import { ZipHeader } from './components/header/ZipHeader';
import { ZipTabContent } from './components/tab/ZipTabContent';
import type { ZipSortMode } from "../../types/zip";
import { getSortModeZipPage, getDefaultSortMode, setSortModeZipPage } from '../../session/zip/sort';

export const ZipPage: React.FC = () => {
    const zip = useZip();
    const count = zip.chunks.length;
    const [sortMode, setSortModeState] = useState<ZipSortMode>(getDefaultSortMode());

    async function fetchSessionData() {
        try {
            const mode = await getSortModeZipPage();
            setSortModeState(mode);
        } catch (e) {}
    }

    useEffect(() => {
        fetchSessionData();
    }, []);

    const setSortMode = (mode: ZipSortMode) => {
        setSortModeState(mode);
        void setSortModeZipPage(mode);
    };

    return (
        <PageLayout hook={zip}>
            <ZipHeader 
                count={count} 
                sortMode={sortMode} 
                onSortChange={setSortMode} 
            />
            <div className="tab-content">
                <ZipTabContent zip={zip} sortMode={sortMode} />
            </div>
        </PageLayout>
    );
};
