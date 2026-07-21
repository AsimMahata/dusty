import type { FileInfo } from "../../types/media";

export const sortFiles = (files: FileInfo[]): FileInfo[] => {
    return [...files].sort((a, b) => {
        if (a.is_dir && !b.is_dir) return -1;
        if (!a.is_dir && b.is_dir) return 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
};
