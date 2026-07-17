import type { SortMethod } from '../../../types/todo';

export const SORT_LABELS: Record<SortMethod, string> = {
    'created': 'Created Date',
    'updated': 'Updated Date',
    'alpha': 'Alphabetical',
    'priority': 'Priority',
    'due': 'Due Date',
    'pinned': 'Pinned First'
};
