import type { ShowTab, ShowSortMethod } from "../../../types/shows";

export const ALL = 'all'


export const TABS: ShowTab[] = [
    { id: 'all', label: 'All Shows' },
    {id: 'seasonal', label: 'Seasonal'},
    { id: 'watching', label: 'Watching' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'planned', label: 'Planned' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'banned', label: 'Banned' },
];

export const STATUS_PRIORITY: Record<string, number> = {
    'watching': 1,
    'planned': 2,
    'on_hold': 3,
    'completed': 4,
    'dropped': 5,
};

export const SHOW_STATUS_WATCHING = 'watching'
export const SHOW_STATUS_COMPLETED = 'completed'
export const SHOW_STATUS_ON_HOLD = 'on_hold'
export const SHOW_STATUS_PLANNED = 'planned'
export const SHOW_STATUS_DROPPED = 'dropped'
export const LOCAL_STORAGE_LAST_WATCHED = 'dusk_last_watched';

export const SORT_OPTIONS: { id: ShowSortMethod, label: string }[] = [
    { id: 'title', label: 'Title' },
    { id: 'status', label: 'Status Priority' },
    { id: 'last_watched', label: 'Last Watched' },
    { id: 'random', label: 'Random' },
    { id: 'malId', label: 'MAL ID' }
];
export const DEFAULT_SORT_METHOD: ShowSortMethod = 'title';
export const DEFAULT_SORT_ASCENDING: boolean = false;
