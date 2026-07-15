import type { useProject } from './useProject';

export const useProjectTab = (project: ReturnType<typeof useProject>) => {
    return {
        title: "Projects",
        recentItems: project.data.recent,
        allItems: project.data.all,
        searchQuery: project.searchQuery,
        onCardClick: project.setSelectedItem,
        handleTogglePin: project.handleTogglePin,
    };
};
