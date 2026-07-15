import type { useZip } from './useZip';

export const useZipTab = (zip: ReturnType<typeof useZip>) => {
    return {
        title: "Zip",
        recentItems: zip.data.recent,
        allItems: zip.data.all,
        searchQuery: zip.searchQuery,
        onCardClick: zip.openZip,
        selectedItem: zip.selectedItem,
        setSelectedItem: zip.setSelectedItem,
    };
};
