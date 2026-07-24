import type { FileInfo } from "../../../types/core";
import type { MediaDir } from "../types/types";

export const getRootFolders = (mediaDirs: MediaDir[]): FileInfo[] => {
    return mediaDirs.map(c => ({
        id: c.id,
        name: c.path.split(/[/\\]/).filter(Boolean).pop() || c.path,
        path: c.path,
        size: c.size || 0,
        is_dir: true,
    }));
};
