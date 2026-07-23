import type { FileInfo } from "./media";

export interface TextDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: TextDir[];
}

export type TextSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
