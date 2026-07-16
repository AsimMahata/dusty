import React from 'react';
import { ChunkList } from '../../components/bazar/ChunkList';
import { useBazarTab } from '../../hooks/bazar/useBazarTab';
import { ICONS } from '../../constants/icon';
import type { useZip } from '../../hooks/zip/useZip';
import type { ZipSortMode } from './ZipPage';
import type { Chunk } from '../../types/bazar';

interface ZipTabProps {
    zip: ReturnType<typeof useZip>;
    sortMode: ZipSortMode;
}

const sortChunks = (chunks: Chunk[], mode: ZipSortMode): Chunk[] => {
    const pinned = chunks.filter(c => c.is_pinned);
    const rest = chunks.filter(c => !c.is_pinned);

    const sorted = [...rest].sort((a, b) => {
        switch (mode) {
            case 'name':      return a.name.localeCompare(b.name, undefined, { numeric: true });
            case 'name-desc': return b.name.localeCompare(a.name, undefined, { numeric: true });
            case 'size':      return (b.size ?? 0) - (a.size ?? 0);
            case 'size-asc':  return (a.size ?? 0) - (b.size ?? 0);
            case 'type':      return (a.ext ?? '').localeCompare(b.ext ?? '') || a.name.localeCompare(b.name, undefined, { numeric: true });
        }
    });

    return [...pinned, ...sorted];
};

export const ZipTab: React.FC<ZipTabProps> = ({ zip, sortMode }) => {
    const tab = useBazarTab(zip);
    const chunks = sortChunks(tab.visibleChunks, sortMode);

    return (
        <ChunkList
            chunks={chunks}
            getChunkActions={tab.getChunkActions}
            emptyIcon={ICONS.FILE.ARCHIVE_OPEN}
            emptyTitle="No ZIP Archives Found"
            emptyDesc="No compressed archives were found. Try refreshing or adjusting the scan path."
        />
    );
};
