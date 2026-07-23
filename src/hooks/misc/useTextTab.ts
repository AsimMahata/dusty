import { useState, useEffect } from 'react';
import { scanText, scanTextTree } from '../../personalities/introverts/misc/text';
import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import type { useMisc } from './useMisc';
import type { Chunk, BazarAction } from '../../types/bazar';
import type { TextDir } from '../../types/text';
import { logger } from '../../utility/logger';

export const useTextTab = (misc: ReturnType<typeof useMisc>) => {
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [textTree, setTextTree] = useState<TextDir[]>([]);
    const [currentTextDirHistory, setCurrentTextDirHistory] = useState<TextDir[]>([]);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const currentTextDir = currentTextDirHistory.length > 0 ? currentTextDirHistory[currentTextDirHistory.length - 1] : null;

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleTextFolderClick = (folder: TextDir) => {
        setCurrentTextDirHistory(prev => [...prev, folder]);
    };

    const goTextBack = () => {
        if (currentTextDirHistory.length > 0) {
            setCurrentTextDirHistory(prev => prev.slice(0, -1));
        }
    };

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Text: failed to open ${chunk.name}: ${String(err)}`);
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
                scanText(sync),
                scanTextTree(sync)
            ]);
            const mapped: Chunk[] = files.map(file => ({
                id: file.id,
                name: file.name,
                path: file.path,
                ext: file.ext || undefined,
                size: file.size || undefined,
                is_pinned: pinnedIds.has(file.id),
            }));
            setChunks(mapped);
            setTextTree(tree);
            setCurrentTextDirHistory([]);
        } catch (error) {
            console.error('Failed to fetch text files:', error);
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
        textTree,
        currentTextDir,
        canGoTextBack: currentTextDirHistory.length > 0,
        handleTextFolderClick,
        goTextBack,
        getChunkActions,
        openChunk,
        fetchData,
        isLoading,
    };
};
