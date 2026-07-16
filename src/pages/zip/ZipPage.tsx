import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useZip } from '../../hooks/zip/useZip';
import { ZipTab } from './ZipTab';

export type ZipSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';

const SORT_OPTIONS: { mode: ZipSortMode; label: string }[] = [
    { mode: 'name',      label: 'A → Z' },
    { mode: 'name-desc', label: 'Z → A' },
    { mode: 'size',      label: 'Largest' },
    { mode: 'size-asc',  label: 'Smallest' },
    { mode: 'type',      label: 'Type' },
];

export const ZipPage: React.FC = () => {
    const zip = useZip();
    const count = zip.chunks.length;
    const [sortMode, setSortMode] = useState<ZipSortMode>('name');

    return (
        <PageLayout hook={zip}>
            <div className="bazar-page-header">
                <div className="bazar-page-header-text">
                    <h2 className="bazar-page-title">ZIP Archives</h2>
                    <p className="bazar-page-subtitle">
                        {count > 0
                            ? `Showing ${count} compressed ${count === 1 ? 'archive' : 'archives'}`
                            : 'Browse and manage compressed archives'}
                    </p>
                </div>

                <div className="zip-sort-bar">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.mode}
                            className={`zip-sort-btn ${sortMode === opt.mode ? 'active' : ''}`}
                            onClick={() => setSortMode(opt.mode)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="tab-content">
                <ZipTab zip={zip} sortMode={sortMode} />
            </div>
        </PageLayout>
    );
};
