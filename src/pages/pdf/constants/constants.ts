import type { PdfSortMode } from "../../../types/pdf";

export const SORT_OPTIONS: { mode: PdfSortMode; label: string }[] = [
    { mode: 'name',      label: 'A → Z' },
    { mode: 'name-desc', label: 'Z → A' },
    { mode: 'size',      label: 'Largest' },
    { mode: 'size-asc',  label: 'Smallest' },
    { mode: 'type',      label: 'Type' },
];

export const PDF_TITLE = 'PDF Documents';
export const PDF_EMPTY_DESC = 'Browse and manage document files';
export const PDF_TAB_EMPTY_TITLE = 'No PDF Documents Found';
export const PDF_TAB_EMPTY_DESC = 'No PDF documents were found. Try refreshing or adjusting the scan path.';
