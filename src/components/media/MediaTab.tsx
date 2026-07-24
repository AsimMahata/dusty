import React from 'react';
import { MediaSourcesPage } from './components/sources/MediaSourcesPage';
import { MediaItemDetailPage } from './components/detail/MediaItemDetailPage';
import { MediaExplorer } from './components/explorer/MediaExplorer';
import { MediaList } from './components/list/MediaList';
import type { TabType } from "../../types/tabs";
import type { useMedia } from './hooks/useMedia';
import { useMediaTab } from './hooks/useMediaTab';

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
            {tab.selectedItem ? <MediaItemDetailPage tab={tab} mediaType={media.mediaType} /> : <MediaList tab={tab} />}
        </div>
    );
};
