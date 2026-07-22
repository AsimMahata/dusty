import React, { useState } from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { ICONS } from '../../../../constants/icon';
import { EXE_FILES_TITLE, EXE_FILES_DESC } from '../../constants/constants';
import { sortChunks, type MiscSortMode } from '../../actions/sortChunks';
import { ExeSortBar } from './ExeSortBar';
import type { useBazarTab } from '../../../../hooks/bazar/useBazarTab';

interface ExeFilesTabProps {
    tab: ReturnType<typeof useBazarTab>;
}

export const ExeFilesTab: React.FC<ExeFilesTabProps> = ({ tab }) => {
    const [sortMode, setSortMode] = useState<MiscSortMode>('size');
    const sortedChunks = sortChunks(tab.visibleChunks, sortMode);

    return (
        <div className="exe-files-tab">
            <ExeSortBar sortMode={sortMode} onSortChange={setSortMode} />
            <ChunkList
                chunks={sortedChunks}
                getChunkActions={tab.getChunkActions}
                emptyIcon={ICONS.FILE.CONFIG}
                emptyTitle={EXE_FILES_TITLE}
                emptyDesc={EXE_FILES_DESC}
            />
        </div>
    );
};
