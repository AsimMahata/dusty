import {
    MORE_VERTICAL_ICON_18,
    CALENDAR_ICON_12,
    TAG_ICON_12,
    PIN_ICON_14_ACCENT,
    CHECK_SQUARE_ICON_20,
    SQUARE_ICON_20,
    ALERT_CIRCLE_ICON_12,
    CLIPBOARD_LIST_ICON_48_EMPTY,
    LIST_TODO_ICON_16,
    PLUS_ICON_16,
    CHEVRON_DOWN_ICON_14,
    ARROW_UP_ICON_16,
    ARROW_DOWN_ICON_16
} from '../../../constants/icon';
import { COLORS } from '../../../constants/color';
import type { TodoCategory, SortMethod } from '../types/types';

export const SORT_LABELS: Record<SortMethod, string> = {
    created: 'Created Date',
    updated: 'Updated Date',
    alpha: 'Alphabetical',
    priority: 'Priority',
    due: 'Due Date',
    pinned: 'Pinned First'
};
export const DEFAULT_CATEGORIES: TodoCategory[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'pinned', label: 'Pinned' }
];

export const PRIORITY_COLORS = {
    High: COLORS.PRIORITY.HIGH,
    Medium: COLORS.PRIORITY.MEDIUM,
    Low: COLORS.PRIORITY.LOW
};

export const PRIORITY_LEVELS: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1
};


// Todo
export const TODO_MORE_VERTICAL_ICON = MORE_VERTICAL_ICON_18;
export const TODO_CALENDAR_ICON = CALENDAR_ICON_12;
export const TODO_TAG_ICON = TAG_ICON_12;
export const TODO_PIN_ICON = PIN_ICON_14_ACCENT;
export const TODO_CHECK_SQUARE_ICON = CHECK_SQUARE_ICON_20;
export const TODO_SQUARE_ICON = SQUARE_ICON_20;
export const TODO_ALERT_CIRCLE_ICON = ALERT_CIRCLE_ICON_12;
export const TODO_CLIPBOARD_LIST_ICON = CLIPBOARD_LIST_ICON_48_EMPTY;
export const TODO_LIST_TODO_ICON = LIST_TODO_ICON_16;
export const TODO_PLUS_ICON = PLUS_ICON_16;
export const TODO_CHEVRON_DOWN_ICON = CHEVRON_DOWN_ICON_14;
export const TODO_ARROW_UP_ICON = ARROW_UP_ICON_16;
export const TODO_ARROW_DOWN_ICON = ARROW_DOWN_ICON_16;
