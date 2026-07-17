import React from 'react';
import type { Item, FileInfo } from "../types/types";



export function formatBytes(bytes: number): string {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;

    if (bytes >= TB) {
        return `${(bytes / TB).toFixed(2)} TB`;
    } else if (bytes >= GB) {
        return `${(bytes / GB).toFixed(2)} GB`;
    } else if (bytes >= MB) {
        return `${(bytes / MB).toFixed(2)} MB`;
    } else if (bytes >= KB) {
        return `${(bytes / KB).toFixed(2)} KB`;
    } else {
        return `${bytes} B`;
    }
}


export const fileInfoToItemData = (files: FileInfo[], defaultFileIcon: React.ReactNode, defaultFolderIcon: React.ReactNode): Item[] => {
    return files.map((file, i) => ({
        id: `${i}`,
        title: file.name,
        subtitle: file.path,
        size: formatBytes(file.size),
        rawSize: file.size,
        icon: (file.is_dir ? defaultFolderIcon : defaultFileIcon),
        path: file.path,
        is_dir: file.is_dir
    }));
};
