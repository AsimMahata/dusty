export const getExplorerTitle = (title: string | undefined, pathHistoryLength: number, currentPath: string): string => {
    if (title && pathHistoryLength === 1) {
        return title;
    }
    return currentPath.split(/[/\\]/).filter(Boolean).pop() || 'File Explorer';
};
