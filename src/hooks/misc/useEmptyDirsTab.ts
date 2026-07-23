import { useState, useEffect } from 'react';
import { scanEmptyDir } from '../../personalities/introverts/empty_dir/scan';
import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import type { useMisc } from './useMisc';
import type { Chunk, BazarAction } from '../../types/bazar';
import { logger } from '../../utility/logger';

export const useEmptyDirsTab = (misc: ReturnType<typeof useMisc>) => {
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`EmptyDirs: failed to open ${chunk.name}: ${String(err)}`);
        }
    };

    const fetchData = async (sync: boolean = false) => {
        if (sync) {
            misc.setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const dirs = await scanEmptyDir(sync);
            const mapped: Chunk[] = dirs.map(file => ({
                id: file.id,
                name: file.name,
                path: file.path,
                ext: file.ext || undefined,
                size: file.size || undefined,
                is_pinned: pinnedIds.has(file.id),
            }));
            setChunks(mapped);
        } catch (error) {
            console.error('Failed to fetch empty directories:', error);
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

    // Filter by search query
    const visibleChunks = chunks.filter(c => {
        if (!misc.searchQuery.trim()) return true;
        const q = misc.searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.path.toLowerCase().includes(q);
    });

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
        visibleChunks,
        getChunkActions,
        openChunk,
        fetchData,
        isLoading,
    };
};
