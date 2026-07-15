import type { useImage } from './useImage';

export const useImageTab = (image: ReturnType<typeof useImage>) => {
    return {
        title: "Images",
        recentItems: image.data.recent,
        allItems: image.data.all,
        searchQuery: image.searchQuery,
        onCardClick: image.openImage,
        selectedItem: image.selectedItem,
        setSelectedItem: image.setSelectedItem,
    };
};
