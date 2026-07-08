import type { LucideIcon } from "lucide-react";

export function createIcon(Icon: LucideIcon) {
    return (<Icon size={24} />);
}
export function formatSize(size: number): string {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;

    if (size >= TB) {
        return `${(size / TB).toFixed(2)} TB`;
    } else if (size >= GB) {
        return `${(size / GB).toFixed(2)} GB`;
    } else if (size >= MB) {
        return `${(size / MB).toFixed(2)} MB`;
    } else if (size >= KB) {
        return `${(size / KB).toFixed(2)} KB`;
    } else {
        return `${size} B`;
    }
}
