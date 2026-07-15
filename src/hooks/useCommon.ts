import { useState } from 'react';

export const useCommon = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return {
        searchQuery, setSearchQuery,
        isRefreshing, setIsRefreshing,
        isLoading, setIsLoading
    };
};
