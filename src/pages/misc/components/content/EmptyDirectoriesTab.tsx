import React from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { ICONS } from '../../../../constants/icon';
import { EMPTY_DIRS_TITLE, EMPTY_DIRS_DESC } from '../../constants/constants';
import type { useBazarTab } from '../../../../hooks/bazar/useBazarTab';

interface EmptyDirectoriesTabProps {
    tab: ReturnType<typeof useBazarTab>;
}

export const EmptyDirectoriesTab: React.FC<EmptyDirectoriesTabProps> = ({ tab }) => {
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
