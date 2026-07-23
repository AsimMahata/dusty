import type { FileInfo } from "./media";

export interface JsonDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: JsonDir[];
}

export type JsonSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
