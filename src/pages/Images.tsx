import React from 'react';
import { useMedia } from '../hooks/media/useMedia';
import { PageLayout } from '../components/layout/PageLayout';
import { TabsOption } from '../components/ui/TabsOption';
import { MediaTab } from '../components/media/MediaTab';

export const Images: React.FC = () => {
    const image = useMedia('Images', 'image');

    return (
        <PageLayout hook={image} >
            <TabsOption
                isItemSelected={image.isItemSelected}
                activeTab={image.activeTab}
                setActiveTab={image.setActiveTab}
                tabs={image.tabs}
            />
            <div className="tab-content">
                <MediaTab media={image} tabType={image.activeTab.type} />
            </div>
        </PageLayout>
    );
};
