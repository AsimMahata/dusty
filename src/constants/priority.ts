import type { ShowStatus } from "../types/shows";

// Status Ordering Priority (lower number = higher priority)
export const SHOW_STATUS_PRIORITY: Record<ShowStatus, number> = {
    watching: 0,
    default: 1,
    planned: 2,
    on_hold: 3,
    dropped: 4,
    completed: 5,
};
