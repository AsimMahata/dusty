import type { TodoCategory } from '../types/todo';

export const DEFAULT_CATEGORIES: TodoCategory[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'pinned', label: 'Pinned' }
];

export const PRIORITY_COLORS = {
    High: 'var(--accent-red, #ef4444)',
    Medium: 'var(--accent-yellow, #eab308)',
    Low: 'var(--accent-blue, #3b82f6)'
};

export const PRIORITY_LEVELS: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1
};
