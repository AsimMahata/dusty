import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useZip } from '../../hooks/zip/useZip';
import { ZipHeader } from './components/header/ZipHeader';
import { ZipTabContent } from './components/tab/ZipTabContent';
import type { ZipSortMode } from "../../types/zip";

export const ZipPage: React.FC = () => {
    const zip = useZip();
    const count = zip.chunks.length;
    const [sortMode, setSortMode] = useState<ZipSortMode>('name');

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
