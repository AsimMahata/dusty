import React, { useMemo } from 'react';
import { FileExplorer } from '../../../fileexplorer/FileExplorer';
import type { FileInfo } from "../../../../types/core";
import type { MediaDir } from "../../types/types";

interface MediaExplorerProps {
    currentDir: MediaDir | null;
    onFolderClick: (dir: MediaDir) => void;
    onFileClick: (file: FileInfo) => void;
    onBack?: () => void;
}

export const MediaExplorer: React.FC<MediaExplorerProps> = ({
    currentDir,
    onFolderClick,
    onFileClick,
    onBack
}) => {
    const files: FileInfo[] = useMemo(() => {
        if (!currentDir) return [];
        const dirs: FileInfo[] = currentDir.childs.map(c => ({
            id: c.id,
            name: c.path.split(/[/\\]/).filter(Boolean).pop() || c.path,
            path: c.path,
            size: c.size || 0,
            is_dir: true,
        }));
        return [...dirs, ...currentDir.media];
    }, [currentDir]);

    if (!currentDir) {
        return <div className="loading">Loading directory...</div>;
    }

    return (
        <FileExplorer
            title={currentDir.path.split(/[/\\]/).filter(Boolean).pop() || 'Media Explorer'}
            currentPath={currentDir.path}
            files={files}
            onBack={onBack}
            onItemClick={(file) => {
                if (file.is_dir) {
                    const child = currentDir.childs.find(c => c.path === file.path);
                    if (child) onFolderClick(child);
                } else {
                    onFileClick(file);
                }
            }}
            loading={false}
        />
    );
};
