import type { SortOption } from "../../../types/projects";
export const PROJECT_SORT_OPTIONS: { id: SortOption, label: string }[] = [
    { id: 'recently_opened', label: 'Recently Opened' },
    { id: 'recently_modified', label: 'Recently Modified' },
    { id: 'alphabetical', label: 'Alphabetical' },
    { id: 'pinned', label: 'Pinned First' },
    { id: 'git_status', label: 'Git Status' },
    { id: 'project_status', label: 'Project Status' }
];

export const DEFAULT_SORT_OPTION: SortOption = "project_status";
