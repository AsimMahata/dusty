import type { FileInfo } from "../../../types/core";

export interface MiscDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: MiscDir[];
}

export type MiscSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
