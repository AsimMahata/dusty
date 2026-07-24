import type { MiscSortMode } from "../../misc/types/types";
export const SORT_OPTIONS: { mode: MiscSortMode; label: string }[] = [
    { mode: 'name', label: 'A → Z' },
    { mode: 'name-desc', label: 'Z → A' },
    { mode: 'size', label: 'Largest' },
    { mode: 'size-asc', label: 'Smallest' },
    { mode: 'type', label: 'Type' },
];

export const ZIP_TITLE = 'ZIP Archives';
export const ZIP_EMPTY_DESC = 'Browse and manage compressed archives';
export const ZIP_TAB_EMPTY_TITLE = 'No ZIP Archives Found';
export const ZIP_TAB_EMPTY_DESC = 'No compressed archives were found. Try refreshing or adjusting the scan path.';
