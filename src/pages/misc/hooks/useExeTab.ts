import { useState, useEffect } from 'react';
import { scanExe, scanExeTree } from '../../../personalities/introverts/misc/exe';
import { openFile } from '../../../personalities/introverts/filesystem/filesystem';
import type { useMisc } from './useMisc';
import type { Chunk, BazarAction } from '../../../components/bazar/types/types';
import type { MiscDir } from '../types/types';
import { logger } from '../../../utility/logger';
import type { FileInfo } from '../../../types/core';

export const useExeTab = (misc: ReturnType<typeof useMisc>) => {
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [exeTree, setExeTree] = useState<MiscDir[]>([]);
    const [currentDirHistory, setCurrentDirHistory] = useState<MiscDir[]>([]);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const currentDir = currentDirHistory.length > 0 ? currentDirHistory[currentDirHistory.length - 1] : null;

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleFolderClick = (folder: MiscDir) => {
        setCurrentDirHistory(prev => [...prev, folder]);
    };

    const goBack = () => {
        if (currentDirHistory.length > 0) {
            setCurrentDirHistory(prev => prev.slice(0, -1));
        }
    };

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Exe: failed to open ${chunk.name}: ${String(err)}`);
        }
    };

    const fetchData = async (sync: boolean = false) => {
        if (sync) {
            misc.setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const [files, tree] = await Promise.all([
                scanExe(sync),
                scanExeTree(sync)
            ]);
            const mapped: Chunk[] = files.map((file: FileInfo) => ({
                id: file.id,
                name: file.name,
                path: file.path,
                ext: file.ext || undefined,
                size: file.size || undefined,
                is_pinned: pinnedIds.has(file.id),
            }));
            setChunks(mapped);
            setExeTree(tree);
            setCurrentDirHistory([]);
        } catch (error) {
            console.error('Failed to fetch executables:', error);
        } finally {
            misc.setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        const timer = setTimeout(() => {
            if (active) {
                fetchData(false);
            }
        }, 100);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (misc.refreshTrigger > 0) {
            fetchData(true);
        }
    }, [misc.refreshTrigger]);

    const getChunkActions = (chunk: Chunk): BazarAction[] => {
        return [
            {
                label: chunk.is_pinned ? 'Unpin' : 'Pin',
                onClick: () => togglePin(chunk.id),
            },
            {
                label: 'Open file location',
                onClick: () => openChunk(chunk),
            }
        ];
    };

    return {
        chunks,
        exeTree,
        currentDir,
        canGoBack: currentDirHistory.length > 0,
        handleFolderClick,
        goBack,
        getChunkActions,
        openChunk,
        fetchData,
        isLoading,
    };
};
