import React from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { ICONS } from '../../../../constants/icon';
import { EMPTY_DIRS_TITLE, EMPTY_DIRS_DESC } from '../../constants/constants';
import { useEmptyDirsTab } from '../../../../hooks/misc/useEmptyDirsTab';
import type { useMisc } from '../../../../hooks/misc/useMisc';

interface EmptyDirectoriesTabProps {
    misc: ReturnType<typeof useMisc>;
}

export const EmptyDirectoriesTab: React.FC<EmptyDirectoriesTabProps> = ({ misc }) => {
    const tab = useEmptyDirsTab(misc);

    if (tab.isLoading) {
        return (
            <div style={{ display: 'flex', height: '100%', minHeight: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Loading...
            </div>
        );
    }

    return (
        <ChunkList
            chunks={tab.visibleChunks}
            getChunkActions={tab.getChunkActions}
            emptyIcon={ICONS.FILE.FOLDER_EMPTY}
            emptyTitle={EMPTY_DIRS_TITLE}
            emptyDesc={EMPTY_DIRS_DESC}
        />
    );
};
