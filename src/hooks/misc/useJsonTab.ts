import { useState, useEffect } from 'react';
import { scanJson, scanJsonTree } from '../../personalities/introverts/misc/json';
import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import type { useMisc } from './useMisc';
import type { Chunk, BazarAction } from '../../types/bazar';
import type { JsonDir } from '../../types/json';
import { logger } from '../../utility/logger';

export const useJsonTab = (misc: ReturnType<typeof useMisc>) => {
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [jsonTree, setJsonTree] = useState<JsonDir[]>([]);
    const [currentJsonDirHistory, setCurrentJsonDirHistory] = useState<JsonDir[]>([]);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const currentJsonDir = currentJsonDirHistory.length > 0 ? currentJsonDirHistory[currentJsonDirHistory.length - 1] : null;

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleJsonFolderClick = (folder: JsonDir) => {
        setCurrentJsonDirHistory(prev => [...prev, folder]);
    };

    const goJsonBack = () => {
        if (currentJsonDirHistory.length > 0) {
            setCurrentJsonDirHistory(prev => prev.slice(0, -1));
        }
    };

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Json: failed to open ${chunk.name}: ${String(err)}`);
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
                scanJson(sync),
                scanJsonTree(sync)
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
            setJsonTree(tree);
            setCurrentJsonDirHistory([]);
        } catch (error) {
            console.error('Failed to fetch JSON files:', error);
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
        jsonTree,
        currentJsonDir,
        canGoJsonBack: currentJsonDirHistory.length > 0,
        handleJsonFolderClick,
        goJsonBack,
        getChunkActions,
        openChunk,
        fetchData,
        isLoading,
    };
};
