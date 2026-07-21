import type { Project } from "../../../types/projects";
import type { SortOption } from "../../../types/projects";

export const filterAndSortProjects = (projects: Project[], searchQuery: string, sortOption: SortOption): Project[] => {
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/).filter(Boolean);

    let filtered = projects;
    if (searchTerms.length > 0) {
        filtered = projects.filter(project => {
            const tags = (project.tags || []).map(t => t.toLowerCase());
            const title = project.title.toLowerCase();
            return searchTerms.every(term =>
                tags.some(tag => tag.includes(term)) || title.includes(term)
            );
        });
    }

    return [...filtered].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        switch (sortOption) {
            case "alphabetical":
                return a.title.localeCompare(b.title);
            case "pinned":
                return a.title.localeCompare(b.title);
            case "git_status":
                return (a.git_info.git_status || "clean").localeCompare(b.git_info.git_status || "clean");
            case "project_status":
                return (a.status || "default").localeCompare(b.status || "default");
            case "recently_opened":
                return (b.last_opened ? Date.parse(b.last_opened) : 0) - (a.last_opened ? Date.parse(a.last_opened) : 0);
            case "recently_modified":
                return (b.last_modified ? Date.parse(b.last_modified) : 0) - (a.last_modified ? Date.parse(a.last_modified) : 0);
            default:
                return 0;
        }
    });
};
