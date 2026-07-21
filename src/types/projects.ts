import type { useProject } from "../hooks/projects/useProject";

export type ProjectType = "C/C++" | "Unknown";

export type ProjectWorkflowStatus = "active" | "paused" | "completed" | "archived" | "broken" | "default";
export interface TagDefinition {
    id: string;
    label: string;
    icon?: React.ReactNode;
    color: string;
}
export interface Project {
    id: string,
    title: string,
    path: string,
    project_type: ProjectType,
    pinned: boolean,
    status: ProjectStatus,
    tags?: string[],
    git_status?: string,
    git_branch?: string,
    cover_image?: string,
    logo?: string,
    last_opened?: string,
    last_modified?: string,
    last_scan?: string,
    description?: string,
    size?: string,
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







