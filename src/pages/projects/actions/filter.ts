import type { Project } from "../../../types/projects";
import type { SortOption } from "../../../types/projects";

export const filterAndSortProjects = (projects: Project[], searchQuery: string, sortOption: SortOption, sortAscending: boolean = true): Project[] => {
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

        let cmp = 0;
        switch (sortOption) {
            case "alphabetical":
                cmp = a.title.localeCompare(b.title);
                break;
            case "pinned":
                cmp = a.title.localeCompare(b.title);
                break;
            case "git_status":
                cmp = (a.git_info?.git_status || "clean").localeCompare(b.git_info?.git_status || "clean");
                break;
            case "project_status":
                cmp = (a.status || "default").localeCompare(b.status || "default");
                break;
            case "recently_opened":
                cmp = (b.last_opened ? Date.parse(b.last_opened) : 0) - (a.last_opened ? Date.parse(a.last_opened) : 0);
                break;
            case "recently_modified":
                cmp = (b.last_modified ? Date.parse(b.last_modified) : 0) - (a.last_modified ? Date.parse(a.last_modified) : 0);
                break;
            default:
                cmp = 0;
        }
        return sortAscending ? cmp : -cmp;
    });
};
