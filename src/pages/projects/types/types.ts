import type { useProject } from "../hooks/useProject";

export type Framework =
    | "React"
    | "Next.js"
    | "Vue"
    | "Angular"
    | "Svelte"
    | "Astro"
    | "SolidJS"
    | "Tauri"
    | "Electron"
    | "Flutter"
    | "Django"
    | "Flask"
    | "FastAPI"
    | "Spring Boot"
    | "Express"
    | "NestJS"
    | "Rails"
    | "Laravel"
    | ".NET"
    | "Unknown";

export type ProjectWorkflowStatus = "active" | "paused" | "completed" | "archived" | "broken" | "default";

export interface TagDefinition {
    id: string;
    label: string;
    icon?: React.ReactNode;
    color: string;
}
export interface GitInfo {
    git_branch?: string;
    git_status?: string;
    git_is_dirty?: boolean;

    git_ahead?: number;
    git_behind?: number;

    git_modified_count?: number;
    git_staged_count?: number;
    git_untracked_count?: number;
    git_conflicted_count?: number;

    git_remote_url?: string;
    git_repo_name?: string;
    git_repo_path?: string;

    git_head_commit?: string;
    git_head_message?: string;
    git_last_commit_date?: string;
}

export interface Project {
    id: string,
    title: string,
    path: string,
    project_type?: Framework,
    pinned: boolean,
    status: ProjectStatus,
    tags?: string[],
    cover_image?: string,
    logo?: string,
    last_opened?: string,
    last_modified?: string,
    last_scan?: string,
    description?: string,
    size?: string,
    git_info: GitInfo,
}

export type ProjectStatus = "default" | "active" | "working" | "paused" | "completed" | "on_hold" | "dropped" | "archived" | "broken";
export type ProjectHook = ReturnType<typeof useProject>;

export interface ProjectAction {
    id: string;
    title: string;
    icon: React.ReactNode;
    onClick: (e: React.MouseEvent, project: Project) => void;
}

export interface ContextMenuItem {
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
    danger?: boolean;
    separator?: boolean;
}

export type SortOption =
    | "recently_opened"
    | "recently_modified"
    | "alphabetical"
    | "pinned"
    | "git_status"
    | "project_status"
    | "creation_date";






