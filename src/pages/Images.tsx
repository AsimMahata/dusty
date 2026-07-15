import React from 'react';
import { CategoryPage } from '../components/category/CategoryPage';
import { ItemDetailPage } from '../components/detail/ItemDetailPage';
import { PageLayout } from '../components/layout/PageLayout';
import { useImage } from '../hooks/images/useImage';
import { useImageTab } from '../hooks/images/useImageTab';

export const Images: React.FC = () => {
    const image = useImage();
    const imageTab = useImageTab(image);


    return (
        <PageLayout
            hook={image}
        >
            {image.selectedItem ? (
                <ItemDetailPage tab={imageTab} />
            ) : (
                <CategoryPage tab={imageTab} />
            )}
        </PageLayout>
    );
};
