import type { ItemStatus } from "../types/types";

const BASE = {
    YELLOW: '#eab308',
    YELLOW_400: '#facc15',
    GREEN: '#10b981',
    GREEN_500: '#22c55e',
    BLUE: '#3b82f6',
    BLUE_HOVER: '#2563eb',
    PURPLE: '#a855f7',
    ORANGE: '#f97316',
    AMBER: '#f59e0b',
    AMBER_HOVER: '#d97706',
    RED: '#ef4444',
    RED_HOVER: '#dc2626',
    ROSE_900: '#9f1239',
    GREEN_HOVER: '#067952',
    FUCHSIA: '#d946ef',
    SKY: '#0ea5e9',
    TEAL: '#14b8a6',
    PINK: '#ec4899',
    CYAN: '#06b6d4',
    ZINC: '#71717a',
    ROSE: '#f43f5e',
    INDIGO: '#6366f1',
    VIOLET: '#8b5cf6',
    MAGENTA: '#c026d3',
    EMERALD: '#10b981',
    LIME: '#84cc16'
};

const DEFAULT_ACCENT = '#6366f1';

export const COLORS = {
    BASE,
    ACTION: {
        BAN_BG: '#dc2626',
        BAN_CONFIRM_BG: '#991b1b',
        BAN_HOVER_BG: '#b91c1c',
        BAN_CONFIRM_BORDER: '#f87171',
        BAN_SHADOW: 'rgba(220, 38, 38, 0.6)',
        UNBAN_BG: '#16a34a',
        UNBAN_CONFIRM_BG: '#14532d',
        UNBAN_HOVER_BG: '#15803d',
        UNBAN_CONFIRM_BORDER: '#4ade80',
        UNBAN_SHADOW: 'rgba(22, 163, 74, 0.6)',
    },
    ICON: {
        FOLDER: '#dcb67a',
        JSON: '#c1bd66',
        CONFIG: '#8a8a8a',
        MARKDOWN: '#4589b2',
        VITE: '#8176ff',
        HTML: '#e34c26',
        CSS: '#264de4',
        JS: '#f0db4f',
        TS: '#007acc',
        IMAGE: '#42a5f5',
        AUDIO: '#ef5350',
        VIDEO: '#ab47bc',
        ARCHIVE: '#ffb300',
        DEFAULT: '#a0a0a0',
    },
    TRANSPARENT: {
        DANGER_BG: 'rgba(239, 68, 68, 0.05)',
        DANGER_BORDER: 'rgba(239, 68, 68, 0.2)',
        BLUE_20: 'rgba(59, 130, 246, 0.2)',
        WHITE_08: 'rgba(255, 255, 255, 0.08)',
    },
    STATUS: {
        SHOW: {
            default: `var(--accent, ${DEFAULT_ACCENT})`,
            watching: BASE.GREEN,
            working: BASE.GREEN,
            completed: BASE.BLUE,
            planned: BASE.PURPLE,
            on_hold: BASE.ORANGE,
            dropped: BASE.RED,
        } as Record<ItemStatus, string>,
        ITEM: {
            default: `var(--accent, ${DEFAULT_ACCENT})`,
            watching: BASE.GREEN,
            working: BASE.GREEN,
            completed: BASE.BLUE,
            planned: BASE.PURPLE,
            on_hold: BASE.ORANGE,
            dropped: BASE.RED,
        } as Record<ItemStatus, string>
    },
    PIN: BASE.YELLOW,
    DEFAULT_ACCENT
};

export const ACTIONS_SEPARATOR = { separator: true, label: '', onClick: () => { } };