import React, { useMemo } from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { BazarBreadcrumbs } from '../../../../components/bazar/BazarBreadcrumbs';
import { useBazarTab } from '../../../../hooks/bazar/useBazarTab';
import { ICONS } from '../../../../constants/icon';
import { sortChunks } from '../../actions/sortChunks';
import type { useZip } from '../../../../hooks/zip/useZip';
import { ZIP_TAB_EMPTY_TITLE, ZIP_TAB_EMPTY_DESC } from '../../constants/constants';
import type { ZipSortMode, ZipDir } from "../../../../types/zip";
import type { Chunk, BazarAction } from '../../../../types/bazar';

interface ZipTabContentProps {
    zip: ReturnType<typeof useZip>;
    sortMode: ZipSortMode;
}

const getZipDirTags = (dir: ZipDir): string[] => {
    const extSet = new Set<string>();
    const collect = (d: ZipDir) => {
        for (const f of d.files) {
            if (f.ext) extSet.add(f.ext.toUpperCase());
            else extSet.add('ZIP');
        }
        for (const child of d.childs) {
            collect(child);
        }
    };
    collect(dir);
    if (extSet.size === 0) extSet.add('ZIP');
    return Array.from(extSet);
};

export const ZipTabContent: React.FC<ZipTabContentProps> = ({ zip, sortMode }) => {
    const tab = useBazarTab(zip);

    // Build folder chunks and file chunks for current directory level
    const currentChunks: Chunk[] = useMemo(() => {
        const folderChunks: (Chunk & { rawDir?: ZipDir })[] = [];
        const fileChunks: Chunk[] = [];

        if (zip.currentDir) {
            // Inside a directory
            for (const childDir of zip.currentDir.childs) {
                const folderName = childDir.path.split(/[/\\]/).filter(Boolean).pop() || childDir.path;
                folderChunks.push({
                    id: childDir.id,
                    name: folderName,
                    path: childDir.path,
                    ext: 'FOLDER',
                    tags: getZipDirTags(childDir),
                    icon: ICONS.FILE.FOLDER,
                    size: childDir.size,
                    is_pinned: false,
                    rawDir: childDir,
                });
            }
            for (const file of zip.currentDir.files) {
                fileChunks.push({
                    id: file.id,
                    name: file.name,
                    path: file.path,
                    ext: file.ext || 'zip',
                    size: file.size,
                    is_pinned: false,
                });
            }
        } else {
            // At Root level: display top-level root folders
            const rootDirs = zip.zipTree.filter(dir =>
                !zip.zipTree.some(other =>
                    other.id !== dir.id &&
                    (dir.path.startsWith(other.path + '/') || dir.path.startsWith(other.path + '\\'))
                )
            );

            for (const dir of rootDirs) {
                const folderName = dir.path.split(/[/\\]/).filter(Boolean).pop() || dir.path;
                folderChunks.push({
                    id: dir.id,
                    name: folderName,
                    path: dir.path,
                    ext: 'FOLDER',
                    tags: getZipDirTags(dir),
                    icon: ICONS.FILE.FOLDER,
                    size: dir.size,
                    is_pinned: false,
                    rawDir: dir,
                });
            }
            // Add root archives
            for (const chunk of tab.visibleChunks) {
                fileChunks.push(chunk);
            }
        }

        return [...folderChunks, ...fileChunks];
    }, [zip.currentDir, zip.zipTree, tab.visibleChunks]);

    // Apply search filtering if query exists
    const filteredChunks = useMemo(() => {
        if (!zip.searchQuery.trim()) return currentChunks;
        const q = zip.searchQuery.toLowerCase();
        return currentChunks.filter(c =>
            c.name.toLowerCase().includes(q) || c.path.toLowerCase().includes(q)
        );
    }, [currentChunks, zip.searchQuery]);

    // Apply sorting to both folders and files (folders stay on top)
    const sortedChunks = useMemo(() => {
        const folders = filteredChunks.filter(c => (c as any).rawDir);
        const files = filteredChunks.filter(c => !(c as any).rawDir);
        const sortedFolders = sortChunks(folders, sortMode);
        const sortedFiles = sortChunks(files, sortMode);
        return [...sortedFolders, ...sortedFiles];
    }, [filteredChunks, sortMode]);

    const handleItemClick = (chunk: Chunk) => {
        const rawDir = (chunk as any).rawDir as ZipDir | undefined;
        if (rawDir) {
            zip.handleFolderClick(rawDir);
        } else {
            tab.getChunkActions(chunk)[0]?.onClick();
        }
    };

    const getChunkActions = (chunk: Chunk): BazarAction[] => {
        const rawDir = (chunk as any).rawDir as ZipDir | undefined;
        if (rawDir) {
            return [
                {
                    label: 'Open Folder',
                    onClick: () => zip.handleFolderClick(rawDir),
                }
            ];
        }
        return tab.getChunkActions(chunk);
    };

    return (
        <div className="zip-tab-content">
            {zip.canGoBack && (
                <BazarBreadcrumbs
                    path={zip.currentDir?.path}
                    canGoBack={zip.canGoBack}
                    onGoBack={zip.goBack}
                />
            )}

            <ChunkList
                chunks={sortedChunks}
                getChunkActions={getChunkActions}
                onItemClick={handleItemClick}
                emptyIcon={ICONS.FILE.ARCHIVE_OPEN}
                emptyTitle={ZIP_TAB_EMPTY_TITLE}
                emptyDesc={ZIP_TAB_EMPTY_DESC}
            />
        </div>
    );
};
