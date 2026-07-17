import React from 'react';
import { MediaSourcesPage } from './sources/MediaSourcesPage';
import { ItemDetailPage } from '../detail/ItemDetailPage';
import type { TabType } from '../../types/types';
import type { useMedia } from '../../hooks/media/useMedia';
import { useMediaTab } from '../../hooks/media/useMediaTab';
import { MediaExplorer } from './MediaExplorer';
import { MediaList } from './MediaList';

interface MediaTabProps {
    media: ReturnType<typeof useMedia>;
    tabType: TabType;
}

export const MediaTab: React.FC<MediaTabProps> = ({ media, tabType }) => {
    const tab = useMediaTab(media, tabType);

    if (tabType === 'folders') {
        if (media.currentDirHistory.length === 0) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <MediaSourcesPage media={media} />
                </div>
            );
        }

        return (
            <MediaExplorer 
                currentDir={media.currentDir}
                onFolderClick={media.handleFolderClick}
                onFileClick={media.playMedia}
                onBack={media.goBack}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {tab.selectedItem ? <ItemDetailPage tab={tab} /> : <MediaList tab={tab} />}
        </div>
    );
};
