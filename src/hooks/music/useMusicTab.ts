import type { TabType } from '../../types/types';
import type { useMusic } from './useMusic';

export const useMusicTab = (music: ReturnType<typeof useMusic>, type: TabType) => {

    const isDirsTab = type === 'media';

    return {
        title: isDirsTab ? 'Music Dirs' : 'Songs',
        recentItems: [],
        allItems: isDirsTab ? music.currentDirItems : music.allSongs,
        searchQuery: music.searchQuery,
        onCardClick: music.playMusic,
        selectedItem: music.selectedItem,
        setSelectedItem: music.setSelectedItem,
        goBack: isDirsTab && music.canGoBack ? music.goBack : undefined,
    };
};
