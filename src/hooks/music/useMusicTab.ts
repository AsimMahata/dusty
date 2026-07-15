import type { useMusic } from './useMusic';

export const useMusicTab = (music: ReturnType<typeof useMusic>) => {
    return {
        title: "Music",
        recentItems: music.data.recent,
        allItems: music.data.all,
        searchQuery: music.searchQuery,
        onCardClick: music.playMusic,
        selectedItem: music.selectedItem,
        setSelectedItem: music.setSelectedItem,
    };
};
