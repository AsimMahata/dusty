import type { ItemStatus } from "../types/types";

// Base Colors
export const COLOR_YELLOW = '#eab308';
export const COLOR_GREEN = '#10b981';
export const COLOR_BLUE = '#3b82f6';
export const COLOR_BLUE_HOVER = '#2563eb';
export const COLOR_PURPLE = '#a855f7';
export const COLOR_ORANGE = '#f97316';
export const COLOR_AMBER = '#f59e0b';
export const COLOR_AMBER_HOVER = '#d97706';
export const COLOR_RED = '#ef4444';
export const COLOR_RED_HOVER = '#dc2626';
export const COLOR_ROSE_900 = '#9f1239';
export const COLOR_GREEN_HOVER = '#067952';
// Specific Button Colors (from Ban/Unban)
export const COLOR_BAN_BG = '#dc2626';
export const COLOR_BAN_CONFIRM_BG = '#991b1b';
export const COLOR_BAN_HOVER_BG = '#b91c1c';
export const COLOR_BAN_CONFIRM_BORDER = '#f87171';

export const COLOR_UNBAN_BG = '#16a34a';
export const COLOR_UNBAN_CONFIRM_BG = '#14532d';
export const COLOR_UNBAN_HOVER_BG = '#15803d';
export const COLOR_UNBAN_CONFIRM_BORDER = '#4ade80';
export const COLOR_UNBAN_SHADOW = 'rgba(22, 163, 74, 0.6)';

export const COLOR_BAN_SHADOW = 'rgba(220, 38, 38, 0.6)';

// File Icon Colors
export const COLOR_ICON_FOLDER = '#dcb67a';
export const COLOR_ICON_JSON = '#c1bd66';
export const COLOR_ICON_CONFIG = '#8a8a8a';
export const COLOR_ICON_MARKDOWN = '#4589b2';
export const COLOR_ICON_VITE = '#8176ff';
export const COLOR_ICON_HTML = '#e34c26';
export const COLOR_ICON_CSS = '#264de4';
export const COLOR_ICON_JS = '#f0db4f';
export const COLOR_ICON_TS = '#007acc';
export const COLOR_ICON_IMAGE = '#42a5f5';
export const COLOR_ICON_AUDIO = '#ef5350';
export const COLOR_ICON_VIDEO = '#ab47bc';
export const COLOR_ICON_ARCHIVE = '#ffb300';
export const COLOR_ICON_DEFAULT = '#a0a0a0';

// Transparent Colors
export const COLOR_DANGER_BG = 'rgba(239, 68, 68, 0.05)';
export const COLOR_DANGER_BORDER = 'rgba(239, 68, 68, 0.2)';
export const COLOR_BLUE_TRANSPARENT_20 = 'rgba(59, 130, 246, 0.2)';
export const COLOR_WHITE_TRANSPARENT_08 = 'rgba(255, 255, 255, 0.08)';

export const COLOR_DEFAULT_ACCENT = '#6366f1';
export const PIN_COLOR = COLOR_YELLOW;
export const ACTIONS_SEPARATOR = { separator: true, label: '', onClick: () => { } };

export const SHOW_STATUS_COLOR: Record<ItemStatus, string> = {
    default: `var(--accent, ${COLOR_DEFAULT_ACCENT})`,
    watching: COLOR_GREEN,
    working: COLOR_GREEN,
    completed: COLOR_BLUE,
    planned: COLOR_PURPLE,
    on_hold: COLOR_ORANGE,
    dropped: COLOR_RED,
};

export const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
    default: `var(--accent, ${COLOR_DEFAULT_ACCENT})`,
    watching: COLOR_GREEN,
    working: COLOR_GREEN,
    completed: COLOR_BLUE,
    planned: COLOR_PURPLE,
    on_hold: COLOR_ORANGE,
    dropped: COLOR_RED,
};