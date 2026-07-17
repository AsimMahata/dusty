import React from 'react';
import { useMedia } from '../../hooks/media/useMedia';
import { PageLayout } from '../../components/layout/PageLayout';
import { TabsOption } from '../../components/ui/TabsOption';
import { MediaTab } from '../../components/media/MediaTab';
import './css/Music.css';

export const Music: React.FC = () => {
    const musicHook = useMedia('Songs List', 'music');

    return (
        <PageLayout hook={musicHook} >
            <div className="music-page-container">
                <TabsOption
                    isItemSelected={musicHook.isItemSelected}
                    activeTab={musicHook.activeTab}
                    setActiveTab={musicHook.setActiveTab}
                    tabs={musicHook.tabs}
                />
                <div className="music-content-container">
                    <MediaTab media={musicHook} tabType={musicHook.activeTab.type} />
                </div>
            </div>
        </PageLayout>
    );
};
