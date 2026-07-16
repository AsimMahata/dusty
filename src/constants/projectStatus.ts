import React from 'react';
import { ICONS } from './icon';
import { COLORS } from './color';

export type ProjectWorkflowStatus = "active" | "paused" | "completed" | "archived" | "broken" | "default";
export type GitStatusValue = "clean" | "modified" | "ahead" | "behind" | "diverged" | "conflict" | "none";

export interface StatusDefinition {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

const PROJECT_STATUSES: Record<ProjectWorkflowStatus, StatusDefinition> = {
    active: { id: "active", label: "Active", icon: ICONS.PROJECT_STATUSES.ACTIVE, color: COLORS.BASE.GREEN_500 },
    paused: { id: "paused", label: "Paused", icon: ICONS.PROJECT_STATUSES.PAUSED, color: COLORS.BASE.YELLOW },
    completed: { id: "completed", label: "Completed", icon: ICONS.PROJECT_STATUSES.COMPLETED, color: COLORS.BASE.BLUE },
    archived: { id: "archived", label: "Archived", icon: ICONS.PROJECT_STATUSES.ARCHIVED, color: COLORS.BASE.ZINC },
    broken: { id: "broken", label: "Broken", icon: ICONS.PROJECT_STATUSES.BROKEN, color: COLORS.BASE.RED },
    default: { id: "default", label: "No Status", icon: ICONS.PROJECT_STATUSES.DEFAULT, color: "#a1a1aa" },
};

const GIT_STATUSES: Record<GitStatusValue, StatusDefinition> = {
    clean: { id: "clean", label: "Git Clean", icon: ICONS.PROJECT_STATUSES.GIT_CLEAN, color: COLORS.BASE.GREEN_500 },
    modified: { id: "modified", label: "Git Modified", icon: ICONS.PROJECT_STATUSES.GIT_MODIFIED, color: COLORS.BASE.YELLOW },
    ahead: { id: "ahead", label: "Git Ahead", icon: ICONS.PROJECT_STATUSES.GIT_AHEAD, color: COLORS.BASE.BLUE },
    behind: { id: "behind", label: "Git Behind", icon: ICONS.PROJECT_STATUSES.GIT_BEHIND, color: COLORS.BASE.PURPLE },
    diverged: { id: "diverged", label: "Git Diverged", icon: ICONS.PROJECT_STATUSES.GIT_DIVERGED, color: COLORS.BASE.ORANGE },
    conflict: { id: "conflict", label: "Merge Conflict", icon: ICONS.PROJECT_STATUSES.GIT_CONFLICT, color: COLORS.BASE.RED },
    none: { id: "none", label: "Not Git Repository", icon: ICONS.PROJECT_STATUSES.GIT_NONE, color: COLORS.BASE.ZINC },
};

const getProjectStatusDefinition = (status?: string): StatusDefinition => {
    const key = (status?.toLowerCase() || "default") as ProjectWorkflowStatus;
    return PROJECT_STATUSES[key] || PROJECT_STATUSES.default;
};

const getGitStatusDefinition = (status?: string): StatusDefinition => {
    const key = (status?.toLowerCase() || "none") as GitStatusValue;
    return GIT_STATUSES[key] || GIT_STATUSES.none;
};

export const PROJECT_STATUS = {
    STATUSES: PROJECT_STATUSES,
    getDefinition: getProjectStatusDefinition
};

export const GIT_STATUS = {
    STATUSES: GIT_STATUSES,
    getDefinition: getGitStatusDefinition
};
