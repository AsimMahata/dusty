import React from 'react';
import { CategoryPage } from '../components/category/CategoryPage';
import { ItemDetailPage } from '../components/detail/ItemDetailPage';
import { PageLayout } from '../components/layout/PageLayout';
import { useZip } from '../hooks/zip/useZip';
import { useZipTab } from '../hooks/zip/useZipTab';

export const Zip: React.FC = () => {
    const zip = useZip();
    const zipTab = useZipTab(zip);

    return (
        <PageLayout hook={zip}>
            {zip.selectedItem ? (
                <ItemDetailPage tab={zipTab} />
            ) : (
                <CategoryPage tab={zipTab} />
            )}
        </PageLayout>
    );
};
