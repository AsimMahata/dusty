import { useState } from 'react';
import { useCommon } from '../useCommon';
import { TYPE_EMPTY_DIRECTORIES } from '../../constants/tabs';

export const useMisc = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [activeTab, setActiveTab] = useState(TYPE_EMPTY_DIRECTORIES);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchData = (sync: boolean = false) => {
        if (sync) {
            setRefreshTrigger(prev => prev + 1);
        }
    };

    return {
        title: "Misc",
        searchQuery, setSearchQuery,
        isRefreshing, setIsRefreshing,
        isLoading, setIsLoading,
        activeTab, setActiveTab,
        refreshTrigger,
        fetchData,
    };
};
