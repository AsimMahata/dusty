import type { MiscSortMode } from '../types/types';

export const SORT_OPTIONS: { mode: MiscSortMode; label: string }[] = [
    { mode: 'size', label: 'Largest' },
    { mode: 'size-asc', label: 'Smallest' },
    { mode: 'name', label: 'A → Z' },
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

export const TITLE_EMPTY_DIRECTORIES = "Empty Directories";
export const TITLE_EXE_FILES = "Executable Files";
export const TITLE_JSON_FILES = "JSON Files";
export const TITLE_TEXT_FILES = "Text Files";
export const TITLE_OFFICE_FILES = "Office Files";
export const TITLE_COMING_SOON = "Coming Soon";

export const TYPE_EMPTY_DIRECTORIES = "empty_directories";
export const TYPE_EXE_FILES = "exe_files";
export const TYPE_JSON_FILES = "json_files";
export const TYPE_TEXT_FILES = "text_files";
export const TYPE_OFFICE_FILES = "office_files";
export const TYPE_COMING_SOON = "coming_soon";
