import type { FileInfo } from "./media";

export interface OfficeDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: OfficeDir[];
}

export type OfficeSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
