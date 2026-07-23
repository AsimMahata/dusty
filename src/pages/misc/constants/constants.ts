import type { MiscSortMode } from '../actions/sortChunks';

export const SORT_OPTIONS: { mode: MiscSortMode; label: string }[] = [
    { mode: 'size',      label: 'Largest' },
    { mode: 'size-asc',  label: 'Smallest' },
    { mode: 'name',      label: 'A → Z' },
    { mode: 'name-desc', label: 'Z → A' },
];

export const EMPTY_DIRS_TITLE = 'No Empty Directories Found';
export const EMPTY_DIRS_DESC = 'No empty folders were detected. The scan may still be running.';

export const EXE_FILES_TITLE = 'No Executable Files Found';
export const EXE_FILES_DESC = 'No executable (.exe) files were detected in valid source paths.';

export const JSON_FILES_TITLE = 'No JSON Files Found';
export const JSON_FILES_DESC = 'No JSON (.json) files were detected in valid source paths.';
export const TEXT_FILES_TITLE = 'No Text Files Found';
export const TEXT_FILES_DESC = 'No text (.txt, .text) files were detected in valid source paths.';
export const OFFICE_FILES_TITLE = 'No Office Files Found';
export const OFFICE_FILES_DESC = 'No Microsoft Office (Word, Excel, PowerPoint) files were detected in valid source paths.';
