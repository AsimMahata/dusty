import React from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { useBazarTab } from '../../../../hooks/bazar/useBazarTab';
import { ICONS } from '../../../../constants/icon';
import { sortChunks } from '../../actions/sortChunks';
import type { useZip } from '../../../../hooks/zip/useZip';
import { ZIP_TAB_EMPTY_TITLE, ZIP_TAB_EMPTY_DESC, type ZipSortMode } from '../../constants/constants';

interface ZipTabContentProps {
    zip: ReturnType<typeof useZip>;
    sortMode: ZipSortMode;
}

export const ZipTabContent: React.FC<ZipTabContentProps> = ({ zip, sortMode }) => {
    const tab = useBazarTab(zip);
    const chunks = sortChunks(tab.visibleChunks, sortMode);

    return (
        <ChunkList
            chunks={chunks}
            getChunkActions={tab.getChunkActions}
            emptyIcon={ICONS.FILE.ARCHIVE_OPEN}
            emptyTitle={ZIP_TAB_EMPTY_TITLE}
            emptyDesc={ZIP_TAB_EMPTY_DESC}
        />
    );
};
