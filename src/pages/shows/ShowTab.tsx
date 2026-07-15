import React from 'react';
import { CategoryPage } from '../../components/category/CategoryPage';
import { ItemDetailPage } from '../../components/detail/ItemDetailPage';
import { useShowTab } from '../../hooks/shows/useShowTab';
import type { useShow } from '../../hooks/shows/useShow';

interface ShowTabProps {
    show: ReturnType<typeof useShow>;
    tabType: 'normal' | 'banned';
}

export const ShowTab: React.FC<ShowTabProps> = ({ show, tabType }) => {
    const tab = useShowTab(show, tabType);

    return (
        tab.selectedItem ? <ItemDetailPage tab={tab} /> : <CategoryPage tab={tab} />
    );
};
