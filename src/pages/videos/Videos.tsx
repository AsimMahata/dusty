import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { useMedia } from '../../components/media/hooks/useMedia';
import { TabsOption } from '../../components/ui/TabsOption';
import { MediaTab } from '../../components/media/MediaTab';
import './css/Videos.css';

export const Videos: React.FC = () => {
    const videoHook = useMedia('Video List', 'video');

    return (
        <PageLayout hook={videoHook} >
            <div className="videos-page-container">
                <TabsOption
                    isItemSelected={videoHook.isItemSelected}
                    activeTab={videoHook.activeTab}
                    setActiveTab={videoHook.setActiveTab}
                    tabs={videoHook.tabs}
                />
                <div className="video-content-container">
                    <MediaTab media={videoHook} tabType={videoHook.activeTab.type} />
                </div>
            </div>
        </PageLayout>
    );
};
