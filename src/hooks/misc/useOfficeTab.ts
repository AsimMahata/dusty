import { useState, useEffect } from 'react';
import { scanOffice, scanOfficeTree } from '../../personalities/introverts/misc/office';
import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import type { useMisc } from './useMisc';
import type { Chunk, BazarAction } from '../../types/bazar';
import type { OfficeDir } from '../../types/office';
import { logger } from '../../utility/logger';

export const useOfficeTab = (misc: ReturnType<typeof useMisc>) => {
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [officeTree, setOfficeTree] = useState<OfficeDir[]>([]);
    const [currentOfficeDirHistory, setCurrentOfficeDirHistory] = useState<OfficeDir[]>([]);
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const currentOfficeDir = currentOfficeDirHistory.length > 0 ? currentOfficeDirHistory[currentOfficeDirHistory.length - 1] : null;

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleOfficeFolderClick = (folder: OfficeDir) => {
        setCurrentOfficeDirHistory(prev => [...prev, folder]);
    };

    const goOfficeBack = () => {
        if (currentOfficeDirHistory.length > 0) {
            setCurrentOfficeDirHistory(prev => prev.slice(0, -1));
        }
    };

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Office: failed to open ${chunk.name}: ${String(err)}`);
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
                scanOffice(sync),
                scanOfficeTree(sync)
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
            setOfficeTree(tree);
            setCurrentOfficeDirHistory([]);
        } catch (error) {
            console.error('Failed to fetch office files:', error);
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
        officeTree,
        currentOfficeDir,
        canGoOfficeBack: currentOfficeDirHistory.length > 0,
        handleOfficeFolderClick,
        goOfficeBack,
        getChunkActions,
        openChunk,
        fetchData,
        isLoading,
    };
};
