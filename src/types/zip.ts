import type { FileInfo } from "./media";

export interface ZipDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: ZipDir[];
}

export type ZipSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
