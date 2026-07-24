import React, { useMemo } from 'react';

import { TABS, SORT_OPTIONS, DEFAULT_SORT_METHOD } from '../../../constants/constants';
import type { useShow } from '../../../hooks/useShow';
import { SortOptions } from '../../../../../components/ui/sortUi/SortOptions';
import { LayoutOptions } from './../layout/LayoutOptions';

interface ShowListHeaderProps {
    showHook: ReturnType<typeof useShow>
}

export const ShowListHeader: React.FC<ShowListHeaderProps> = ({ showHook }) => {
    const { activeTab, getCount, isGridLayout, setIsGridLayout } = showHook;

    const headerLabel = useMemo(() => {
        return TABS.find(t => t.id === activeTab?.id)?.label || 'Shows';
    }, [activeTab]);

    const showCount = useMemo(() => {
        return getCount(activeTab);
    }, [activeTab, getCount]);

    return (
        <div className="show-list-header">
            <div className="show-list-title">
                {headerLabel} ({showCount})
            </div>
            <div className="show-list-actions">
                <SortOptions 
                    sortMethod={showHook.sortMethod}
                    sortAscending={showHook.sortAscending}
                    setSortAscending={showHook.setSortAscending}
                    handleSortChange={(method) => showHook.handleSortChange(method as any)}
                    options={SORT_OPTIONS}
                    defaultSortMethodLabel={DEFAULT_SORT_METHOD}
                />
                
                <LayoutOptions 
                    isGridLayout={isGridLayout} 
                    setIsGridLayout={setIsGridLayout} 
                />
            </div>
        </div>
    );
};
