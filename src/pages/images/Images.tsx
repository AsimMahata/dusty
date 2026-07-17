import React from 'react';
import { useMedia } from '../../hooks/media/useMedia';
import { PageLayout } from '../../components/layout/PageLayout';
import { TabsOption } from '../../components/ui/TabsOption';
import { MediaTab } from '../../components/media/MediaTab';
import './css/Images.css';

export const Images: React.FC = () => {
    const imageHook = useMedia('Image List', 'image');

    return (
        <PageLayout hook={imageHook} >
            <div className="images-page-container">
                <TabsOption
                    isItemSelected={imageHook.isItemSelected}
                    activeTab={imageHook.activeTab}
                    setActiveTab={imageHook.setActiveTab}
                    tabs={imageHook.tabs}
                />
                <div className="image-content-container">
                    <MediaTab media={imageHook} tabType={imageHook.activeTab.type} />
                </div>
            </div>
        </PageLayout>
    );
};
