import React from 'react';
import { CategoryPage } from '../components/category/CategoryPage';
import { ItemDetailPage } from '../components/detail/ItemDetailPage';
import { PageLayout } from '../components/layout/PageLayout';
import { useMusic } from '../hooks/music/useMusic';
import { useMusicTab } from '../hooks/music/useMusicTab';

export const Music: React.FC = () => {
    const music = useMusic();
    const musicTab = useMusicTab(music);

    return (
        <PageLayout
            hook={music}
        >
            {music.selectedItem ? (
                <ItemDetailPage tab={musicTab} />
            ) : (
                <CategoryPage tab={musicTab} />
            )}
        </PageLayout>
    );
};
