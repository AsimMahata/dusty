import React from 'react';
import { CategoryPage } from '../components/category/CategoryPage';
import { ItemDetailPage } from '../components/detail/ItemDetailPage';
import { PageLayout } from '../components/layout/PageLayout';
import { useVideo } from '../hooks/videos/useVideo';
import { useVideoTab } from '../hooks/videos/useVideoTab';

export const Videos: React.FC = () => {
    const video = useVideo();
    const videoTab = useVideoTab(video);

    return (
        <PageLayout
            hook={video}
        >
            {video.selectedItem ? (
                <ItemDetailPage tab={videoTab} />
            ) : (
                <CategoryPage tab={videoTab} />
            )}
        </PageLayout>
    );
};
