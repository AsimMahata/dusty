import React from 'react';
import { CategoryPage } from '../../components/category/CategoryPage';
import { ItemDetailPage } from '../../components/detail/ItemDetailPage';
import { useShowTab } from '../../hooks/shows/useShowTab';
import type { useShow } from '../../hooks/shows/useShow';
import type { TabType } from '../../types/types';

interface ShowTabProps {
    show: ReturnType<typeof useShow>;
    tabType: TabType
}

export const ShowTab: React.FC<ShowTabProps> = ({ show, tabType }) => {
    const tab = useShowTab(show, tabType);

    return (
        tab.selectedItem ? <ItemDetailPage tab={tab} /> : <CategoryPage tab={tab} />
    );
};
