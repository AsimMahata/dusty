import React from 'react';
import { useMedia } from '../../hooks/media/useMedia';
import { PageLayout } from '../../components/layout/PageLayout';
import { TabsOption } from '../../components/ui/TabsOption';
import { MediaTab } from '../../components/media/MediaTab';

export const Music: React.FC = () => {
    const music = useMedia('Songs List', 'music');

    return (
        <PageLayout hook={music} >
            <TabsOption

                isItemSelected={music.isItemSelected}
                activeTab={music.activeTab}
                setActiveTab={music.setActiveTab}
                tabs={music.tabs}
            />
            <div className="tab-content">
                <MediaTab media={music} tabType={music.activeTab.type} />
            </div>
        </PageLayout>
    );
};
