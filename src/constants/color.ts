import type { ItemStatus } from "../types/types";

export const PIN_COLOR = '#eab308';
export const ACTIONS_SEPARATOR = { separator: true, label: '', onClick: () => { } };

export const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
    default: "var(--accent, #6366f1)",
    watching: "#10b981", // Green
    working: "#10b981", // Green
    completed: "#3b82f6", // Blue
    planned: "#a855f7", // Purple
    on_hold: "#f97316", // Orange
    dropped: "#ef4444", // Red
};
