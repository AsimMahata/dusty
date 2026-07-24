import type { Tab, TabType } from "../../../types/tabs";
import type { ShowStatus, ShowSortMethod, ShowTab } from "../types/types";
import {
    TV_ICON_48,
    PLAY_ICON_12,
    CHECK_ICON_12,
    CLOCK_ICON_12,
    FOLDER_ICON_48,
    PLAY_ICON_18,
    STATUS_DOT_ICON
} from "../../../constants/icon";

// Icons

export const SHOW_PAGE_FALLBACK_ICON = TV_ICON_48;
export const SHOW_WATCHING_ICON = PLAY_ICON_12;
export const SHOW_COMPLETED_ICON = CHECK_ICON_12;
export const SHOW_PLANNED_ICON = CLOCK_ICON_12;
export const SHOW_DEFAULT_STATUS_ICON = STATUS_DOT_ICON;
export const NO_EPISODE_AVAILABLE_ICON = FOLDER_ICON_48;
export const EPISODE_PLAY_ICON_18 = PLAY_ICON_18;

// Status

export const SHOW_STATUS_PRIORITY: Record<ShowStatus, number> = {
    watching: 0,
    default: 1,
    planned: 2,
    on_hold: 3,
    dropped: 4,
    completed: 5,
};

export const STATUS_PRIORITY: Record<string, number> = {
    watching: 1,
    planned: 2,
    on_hold: 3,
    completed: 4,
    dropped: 5,
};

export const SHOW_STATUS_WATCHING = "watching";
export const SHOW_STATUS_COMPLETED = "completed";
export const SHOW_STATUS_ON_HOLD = "on_hold";
export const SHOW_STATUS_PLANNED = "planned";
export const SHOW_STATUS_DROPPED = "dropped";

// Titles

export const TITLE_SHOWS = "Shows";
export const TITLE_BANNED = "Banned Shows";

// Tabs

export const TYPE_NORMAL: TabType = "normal";
export const TYPE_BANNED: TabType = "banned";

export const SHOW_TAB: Tab = {
    title: TITLE_SHOWS,
    type: TYPE_NORMAL,
};

export const SHOW_BANNED_TAB: Tab = {
    title: TITLE_BANNED,
    type: TYPE_BANNED,
};

export const ALL = "all";

export const TABS: ShowTab[] = [
    { id: "all", label: "All Shows" },
    { id: "seasonal", label: "Seasonal" },
    { id: "watching", label: "Watching" },
    { id: "completed", label: "Completed" },
    { id: "on_hold", label: "On Hold" },
    { id: "planned", label: "Planned" },
    { id: "dropped", label: "Dropped" },
    { id: "banned", label: "Banned" },
];

// Sort

export const SORT_OPTIONS: { id: ShowSortMethod; label: string }[] = [
    { id: "title", label: "Title" },
    { id: "status", label: "Status Priority" },
    { id: "last_watched", label: "Last Watched" },
    { id: "random", label: "Random" },
    { id: "malId", label: "MAL ID" },
];

export const DEFAULT_SORT_METHOD: ShowSortMethod = "title";
export const DEFAULT_SORT_ASCENDING = false;

// Storage

export const LOCAL_STORAGE_LAST_WATCHED = "dusty_last_watched";
export const CONTINUE_WATCHING_TO_SHOW_PAGE = "continue-watching-to-show-page";

// Actions

export const SHOW_ACTION_MENU_LABELS = {
    // General Actions
    PIN: "Pin",
    UNPIN: "Unpin",
    EDIT_MAL_ID: "Edit MAL ID",
    SEARCH_IN_MAL: "Search in MAL",

    // Status Updates
    MARK_WATCHING: "Mark as Watching",
    MARK_WORKING: "Mark as Working",
    MARK_COMPLETED: "Mark as Completed",
    MARK_PLANNED: "Mark as Planned",
    MARK_ON_HOLD: "Mark as On Hold",
    MARK_DROPPED: "Mark as Dropped",
    MARK_DEFAULT: "Mark as Default",

    // General File Actions
    OPEN: "Open",

    // Show Management
    BAN_SHOW: "Ban Show",
    UNBAN_SHOW: "Unban Show",
} as const;
