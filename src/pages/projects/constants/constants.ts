// imports
import type { SortOption, ProjectWorkflowStatus, TagDefinition } from '../types/types';
import {
    ICONS, FOLDER_ICON_28, STAR_ICON_12, STAR_ICON_14_MARGIN, STAR_ICON_16, FOLDER_ICON_48_OPACITY, MONITOR_ICON_18, FOLDER_OPEN_ICON_18,
    GLOBE_ICON_18, ZAP_ICON_18, MORE_VERTICAL_ICON_18, ARROW_LEFT_ICON_14, X_ICON_14, EXTERNAL_LINK_ICON_16, STAR_ICON_16_NONE, CIRCLE_DOT_ICON_16,
    FOLDER_OPEN_ICON_16, TERMINAL_ICON_16, MONITOR_ICON_16, GLOBE_ICON_16, TAGS_ICON_16, PENCIL_ICON_16, TRASH_ICON_16
} from "../../../constants/icon";
import { COLORS } from "../../../constants/color";

// types
type GitStatusValue = "clean" | "modified" | "ahead" | "behind" | "diverged" | "conflict" | "none";

interface StatusDefinition {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

// sorting
export const PROJECT_SORT_OPTIONS: { id: SortOption, label: string }[] = [
    { id: 'recently_opened', label: 'Recently Opened' },
    { id: 'recently_modified', label: 'Recently Modified' },
    { id: 'alphabetical', label: 'Alphabetical' },
    { id: 'pinned', label: 'Pinned First' },
    { id: 'git_status', label: 'Git Status' },
    { id: 'project_status', label: 'Project Status' }
];

export const DEFAULT_SORT_OPTION: SortOption = "project_status";

// actions
export const PROJECT_ACTION_LABELS = {
    SCAN_TAGS: "Scan for Tags",
    SCANNING_TAGS: "Scanning...",
    SCANNED_TAGS: "Scan Result",
    SAVE: "Save",
    CANCEL: "Cancel",
    SEARCH_TAGS_PLACEHOLDER: "Search tags...",
} as const;

// statuses
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
    none: { id: "none", label: "Unknown", icon: ICONS.PROJECT_STATUSES.GIT_NONE, color: COLORS.BASE.ZINC },
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

// tags
const PREDEFINED_TAGS: Record<string, TagDefinition> = {
    rust: { id: "rust", label: "Rust", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.ORANGE },
    typescript: { id: "typescript", label: "TypeScript", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.BLUE },
    javascript: { id: "javascript", label: "JavaScript", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.YELLOW },
    react: { id: "react", label: "React", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.BLUE },
    nextjs: { id: "nextjs", label: "Next.js", icon: ICONS.PROJECT_TAGS.REACT, color: COLORS.BASE.ZINC },
    vue: { id: "vue", label: "Vue", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.GREEN },
    angular: { id: "angular", label: "Angular", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.RED },
    svelte: { id: "svelte", label: "Svelte", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.ORANGE },
    astro: { id: "astro", label: "Astro", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.PURPLE },
    solidjs: { id: "solidjs", label: "SolidJS", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.SKY },
    tauri: { id: "tauri", label: "Tauri", icon: ICONS.PROJECT_TAGS.TAURI, color: COLORS.BASE.YELLOW },
    electron: { id: "electron", label: "Electron", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.BLUE },
    python: { id: "python", label: "Python", icon: ICONS.PROJECT_TAGS.PYTHON, color: COLORS.BASE.YELLOW_400 },
    django: { id: "django", label: "Django", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN },
    flask: { id: "flask", label: "Flask", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ZINC },
    fastapi: { id: "fastapi", label: "FastAPI", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    java: { id: "java", label: "Java", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    spring_boot: { id: "spring_boot", label: "Spring Boot", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN_500 },
    nodejs: { id: "nodejs", label: "Node.js", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.GREEN },
    express: { id: "express", label: "Express", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ZINC },
    nestjs: { id: "nestjs", label: "NestJS", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ROSE },
    c_cpp: { id: "c_cpp", label: "C/C++", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.BLUE },
    csharp: { id: "csharp", label: "C#", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.PURPLE },
    dotnet: { id: "dotnet", label: ".NET", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.VIOLET },
    go: { id: "go", label: "Go", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.CYAN },
    php: { id: "php", label: "PHP", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.INDIGO },
    laravel: { id: "laravel", label: "Laravel", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    ruby: { id: "ruby", label: "Ruby", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.ROSE },
    rails: { id: "rails", label: "Rails", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.RED },
    dart: { id: "dart", label: "Dart", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.SKY },
    flutter: { id: "flutter", label: "Flutter", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.CYAN },
    ai: { id: "ai", label: "AI", icon: ICONS.PROJECT_TAGS.AI, color: COLORS.BASE.PURPLE },
    machine_learning: { id: "machine_learning", label: "Machine Learning", icon: ICONS.PROJECT_TAGS.MACHINE_LEARNING, color: COLORS.BASE.FUCHSIA },
    game: { id: "game", label: "Game", icon: ICONS.PROJECT_TAGS.GAME, color: COLORS.BASE.RED },
    desktop: { id: "desktop", label: "Desktop", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.SKY },
    backend: { id: "backend", label: "Backend", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    frontend: { id: "frontend", label: "Frontend", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.PINK },
    web: { id: "web", label: "Web", icon: ICONS.PROJECT_TAGS.FRONTEND, color: COLORS.BASE.SKY },
    mobile: { id: "mobile", label: "Mobile", icon: ICONS.PROJECT_TAGS.DESKTOP, color: COLORS.BASE.VIOLET },
    cli: { id: "cli", label: "CLI", icon: ICONS.PROJECT_TAGS.RUST, color: COLORS.BASE.ZINC },
    api: { id: "api", label: "API", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.TEAL },
    database: { id: "database", label: "Database", icon: ICONS.PROJECT_TAGS.BACKEND, color: COLORS.BASE.INDIGO },
    automation: { id: "automation", label: "Automation", icon: ICONS.PROJECT_TAGS.TAURI, color: COLORS.BASE.AMBER },
    open_source: { id: "open_source", label: "Open Source", icon: ICONS.PROJECT_TAGS.PERSONAL, color: COLORS.BASE.EMERALD },
    personal: { id: "personal", label: "Personal", icon: ICONS.PROJECT_TAGS.PERSONAL, color: COLORS.BASE.GREEN_500 },
    college: { id: "college", label: "College", icon: ICONS.PROJECT_TAGS.COLLEGE, color: COLORS.BASE.CYAN },
    archived: { id: "archived", label: "Archived", icon: ICONS.PROJECT_TAGS.ARCHIVED, color: COLORS.BASE.ZINC },
    vite: { id: "vite", label: "Vite", icon: ICONS.PROJECT_TAGS.VITE, color: COLORS.ICON.VITE },
};

const getTagDefinition = (tagId: string): TagDefinition => {
    const normalized = tagId.toLowerCase().replace(" ", "_");
    if (PREDEFINED_TAGS[normalized]) {
        return PREDEFINED_TAGS[normalized];
    }

    // Fallback for unknown tags
    return {
        id: tagId,
        label: tagId.charAt(0).toUpperCase() + tagId.slice(1),
        color: "#52525b" // text-muted
    };
};

const getAllPredefinedTags = (): TagDefinition[] => {
    return Object.values(PREDEFINED_TAGS);
};

export const PROJECT_TAGS = {
    PREDEFINED: PREDEFINED_TAGS,
    getDefinition: getTagDefinition,
    getAllPredefined: getAllPredefinedTags
};

// icons
export const PROJECT_BANNER_FOLDER_ICON = FOLDER_ICON_28;
export const PROJECT_PINNED_STAR_ICON_12 = STAR_ICON_12;
export const PROJECT_PINNED_STAR_ICON_14 = STAR_ICON_14_MARGIN;
export const PROJECT_PINNED_STAR_ICON_16 = STAR_ICON_16;
export const PROJECT_FALLBACK_FOLDER_ICON_48 = FOLDER_ICON_48_OPACITY;
export const PROJECT_OPEN_VSCODE_ICON = MONITOR_ICON_18;
export const PROJECT_OPEN_EXPLORER_ICON = FOLDER_OPEN_ICON_18;
export const PROJECT_OPEN_GITHUB_ICON = GLOBE_ICON_18;
export const PROJECT_OPEN_ZAP_ICON = ZAP_ICON_18;
export const PROJECT_MENU_MORE_ICON = MORE_VERTICAL_ICON_18;
export const PROJECT_BACK_ARROW_ICON = ARROW_LEFT_ICON_14;
export const PROJECT_CLOSE_X_ICON = X_ICON_14;
export const PROJECT_EXTERNAL_LINK_ICON = EXTERNAL_LINK_ICON_16;

export const PROJECT_MENU_STAR_ICON = STAR_ICON_16_NONE;
export const PROJECT_MENU_STAR_FILLED_ICON = STAR_ICON_16;
export const PROJECT_MENU_STATUS_ICON = CIRCLE_DOT_ICON_16;
export const PROJECT_MENU_EXPLORER_ICON = FOLDER_OPEN_ICON_16;
export const PROJECT_MENU_TERMINAL_ICON = TERMINAL_ICON_16;
export const PROJECT_MENU_VSCODE_ICON = MONITOR_ICON_16;
export const PROJECT_MENU_GITHUB_ICON = GLOBE_ICON_16;
export const PROJECT_MENU_TAGS_ICON = TAGS_ICON_16;
export const PROJECT_MENU_RENAME_ICON = PENCIL_ICON_16;
export const PROJECT_MENU_DELETE_ICON = TRASH_ICON_16;
