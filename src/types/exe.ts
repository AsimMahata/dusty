import type { FileInfo } from "./media";

export interface ExecutableDir {
    id: string;
    path: string;
    size?: number;
    files: FileInfo[];
    childs: ExecutableDir[];
}
