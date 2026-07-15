import type { useVideo } from './useVideo';

export const useVideoTab = (video: ReturnType<typeof useVideo>) => {
    return {
        title: "Videos",
        recentItems: video.data.recent,
        allItems: video.data.all,
        searchQuery: video.searchQuery,
        onCardClick: video.playVideo,
        selectedItem: video.selectedItem,
        setSelectedItem: video.setSelectedItem,
    };
};
