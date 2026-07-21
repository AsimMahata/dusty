import type { useMedia } from './useMedia';
import type { TabType } from "../../types/tabs";
import type { Item } from "../../types/core";

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
        recentItems: [],
        allItems: isExplorerTab ? media.rootFolderItems : media.allMediaItems,
        searchQuery: media.searchQuery,
        onCardClick: isExplorerTab ? handleRootCardClick : media.playMedia,
        selectedItem: media.selectedItem,
        setSelectedItem: media.setSelectedItem,
        goBack: isExplorerTab && media.canGoBack ? media.goBack : undefined,
    };
};
