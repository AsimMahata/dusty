import React, { useState, useMemo, useEffect } from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { BazarBreadcrumbs } from '../../../../components/bazar/BazarBreadcrumbs';
import { ICONS } from '../../../../constants/icon';
import { EXE_FILES_TITLE, EXE_FILES_DESC } from '../../constants/constants';
import { sortChunks, type MiscSortMode } from '../../actions/sortChunks';
import { ExeSortBar } from './ExeSortBar';
import { useExeTab } from '../../../../hooks/misc/useExeTab';
import type { useMisc } from '../../../../hooks/misc/useMisc';
import type { Chunk, BazarAction } from '../../../../types/bazar';
import type { ExecutableDir } from '../../../../types/exe';
import { getSortModeMiscPage, getDefaultSortMode, setSortModeMiscPage } from '../../../../session/misc/sort';

interface ExeFilesTabProps {
    misc: ReturnType<typeof useMisc>;
}

const getExeDirTags = (dir: ExecutableDir): string[] => {
    const extSet = new Set<string>();
    const collect = (d: ExecutableDir) => {
        for (const f of d.files) {
            if (f.ext) extSet.add(f.ext.toUpperCase());
            else extSet.add('EXE');
        }
        for (const child of d.childs) {
            collect(child);
        }
    };
    collect(dir);
    if (extSet.size === 0) extSet.add('EXE');
    return Array.from(extSet);
};

export const ExeFilesTab: React.FC<ExeFilesTabProps> = ({ misc }) => {
    const tab = useExeTab(misc);
    const [sortMode, setSortModeState] = useState<MiscSortMode>(getDefaultSortMode());

    async function fetchSessionData() {
        try {
            const mode = await getSortModeMiscPage();
            setSortModeState(mode);
        } catch (e) {}
    }

    useEffect(() => {
        fetchSessionData();
    }, []);

    const setSortMode = (mode: MiscSortMode) => {
        setSortModeState(mode);
        void setSortModeMiscPage(mode);
    };

    // Build folder chunks and file chunks for current directory level
    const currentChunks: Chunk[] = useMemo(() => {
        const folderChunks: (Chunk & { rawDir?: ExecutableDir })[] = [];
        const fileChunks: Chunk[] = [];

        if (tab.currentDir) {
            // Inside a directory
            for (const childDir of tab.currentDir.childs) {
                const folderName = childDir.path.split(/[/\\]/).filter(Boolean).pop() || childDir.path;
                folderChunks.push({
                    id: childDir.id,
                    name: folderName,
                    path: childDir.path,
                    ext: 'FOLDER',
                    tags: getExeDirTags(childDir),
                    icon: ICONS.FILE.FOLDER,
                    size: childDir.size,
                    is_pinned: false,
                    rawDir: childDir,
                });
            }
            for (const file of tab.currentDir.files) {
                fileChunks.push({
                    id: file.id,
                    name: file.name,
                    path: file.path,
                    ext: file.ext || 'exe',
                    size: file.size,
                    is_pinned: false,
                });
            }
        } else {
            // At Root level: display top-level root folders
            const rootDirs = tab.exeTree.filter(dir => 
                !tab.exeTree.some(other => 
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
                    tags: getExeDirTags(dir),
                    icon: ICONS.FILE.FOLDER,
                    size: dir.size,
                    is_pinned: false,
                    rawDir: dir,
                });
            }
            // Add root executables
            for (const chunk of tab.chunks) {
                fileChunks.push(chunk);
            }
        }

        return [...folderChunks, ...fileChunks];
    }, [tab.currentDir, tab.exeTree, tab.chunks]);

    // Apply search filtering if query exists
    const filteredChunks = useMemo(() => {
        if (!misc.searchQuery.trim()) return currentChunks;
        const q = misc.searchQuery.toLowerCase();
        return currentChunks.filter(c => 
            c.name.toLowerCase().includes(q) || c.path.toLowerCase().includes(q)
        );
    }, [currentChunks, misc.searchQuery]);

    // Apply sorting to both folders and files (folders stay on top)
    const sortedChunks = useMemo(() => {
        const folders = filteredChunks.filter(c => (c as any).rawDir);
        const files = filteredChunks.filter(c => !(c as any).rawDir);
        const sortedFolders = sortChunks(folders, sortMode);
        const sortedFiles = sortChunks(files, sortMode);
        return [...sortedFolders, ...sortedFiles];
    }, [filteredChunks, sortMode]);

    const handleItemClick = (chunk: Chunk) => {
        const rawDir = (chunk as any).rawDir as ExecutableDir | undefined;
        if (rawDir) {
            tab.handleFolderClick(rawDir);
        } else {
            tab.openChunk(chunk);
        }
    };

    const getChunkActions = (chunk: Chunk): BazarAction[] => {
        const rawDir = (chunk as any).rawDir as ExecutableDir | undefined;
        if (rawDir) {
            return [
                {
                    label: 'Open Folder',
                    onClick: () => tab.handleFolderClick(rawDir),
                }
            ];
        }
        return tab.getChunkActions(chunk);
    };

    if (tab.isLoading) {
        return (
            <div style={{ display: 'flex', height: '100%', minHeight: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="exe-files-tab">
            <BazarBreadcrumbs
                path={tab.currentDir?.path}
                canGoBack={tab.canGoBack}
                onGoBack={tab.goBack}
            >
                <ExeSortBar sortMode={sortMode} onSortChange={setSortMode} />
            </BazarBreadcrumbs>

            <ChunkList
                chunks={sortedChunks}
                getChunkActions={getChunkActions}
                onItemClick={handleItemClick}
                emptyIcon={ICONS.FILE.CONFIG}
                emptyTitle={EXE_FILES_TITLE}
                emptyDesc={EXE_FILES_DESC}
            />
        </div>
    );
};
