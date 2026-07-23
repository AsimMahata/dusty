import type { FileInfo } from "./media";

export interface PdfDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: PdfDir[];
}

export type PdfSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
