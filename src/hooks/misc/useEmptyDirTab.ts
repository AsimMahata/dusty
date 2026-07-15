import type { useMisc } from './useMisc';

export const useEmptyDirTab = (misc: ReturnType<typeof useMisc>) => {
    return {
        title: "Empty Directories",
        recentItems: [],
        allItems: misc.data,
        searchQuery: misc.searchQuery,
        onCardClick: () => {},
    };
};
