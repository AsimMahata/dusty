import type { FileInfo } from "../../../types/core";
import type { MediaDir } from "../types/types";

export const flattenMediaDirs = (mediaDirs: MediaDir[]): FileInfo[] => {
    const flat: FileInfo[] = [];
    const traverse = (dir: MediaDir) => {
        flat.push(...dir.media);
        dir.childs.forEach(traverse);
    };
    mediaDirs.forEach(traverse);
    return flat;
};
