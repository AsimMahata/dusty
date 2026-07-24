import type { Item } from '../../../types/core';
import type { TabType } from '../../../types/tabs';
import type { useMedia } from './useMedia';

const EMPTY_ARRAY: any[] = [];

export const useMediaTab = (media: ReturnType<typeof useMedia>, type: TabType) => {

    const isExplorerTab = type === 'folders';

    const handleRootCardClick = (item: Item) => {
        const childDir = media.mediaDirs.find(c => c.path === item.path);
        if (childDir) {
            media.handleFolderClick(childDir);
        }
    };

    return {
        title: isExplorerTab ? 'Explorer' : 'Media List',
        recentItems: EMPTY_ARRAY,
        allItems: isExplorerTab ? media.rootFolderItems : media.allMediaItems,
        searchQuery: media.searchQuery,
        onCardClick: isExplorerTab ? handleRootCardClick : media.playMedia,
        selectedItem: media.selectedItem,
        setSelectedItem: media.setSelectedItem,
        goBack: isExplorerTab && media.canGoBack ? media.goBack : undefined,
    };
};
