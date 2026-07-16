import React from 'react';
import { useMedia } from '../hooks/media/useMedia';
import { PageLayout } from '../components/layout/PageLayout';
import { TabsOption } from '../components/ui/TabsOption';
import { MediaTab } from '../components/media/MediaTab';

export const Videos: React.FC = () => {
    const video = useMedia('Video List', 'video');

    return (
        <PageLayout hook={video} >
            <TabsOption
                isItemSelected={video.isItemSelected}
                activeTab={video.activeTab}
                setActiveTab={video.setActiveTab}
                tabs={video.tabs}
            />
            <div className="tab-content">
                <MediaTab media={video} tabType={video.activeTab.type} />
            </div>
        </PageLayout>
    );
};
