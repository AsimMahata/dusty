import { useState, useEffect } from 'react';
import { useCommon } from '../useCommon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_OPEN_FILE, CMD_SCAN_ZIP } from '../../constants/commands';
import type { Chunk } from '../../types/bazar';
import { logger } from '../../utility/logger';
import type { FileInfo } from "../../types/media";

let cachedChunks: Chunk[] | null = null;

const fileInfoToChunk = (file: FileInfo): Chunk => ({
    id: file.id,
    name: file.name,
    path: file.path,
    ext: file.ext,
    size: file.size,
    is_pinned: false,
});

export const useZip = () => {
    const { searchQuery, setSearchQuery, isRefreshing, setIsRefreshing, isLoading, setIsLoading } = useCommon();
    const [chunks, setChunks] = useState<Chunk[]>(cachedChunks ?? []);

    const fetchData = async () => {
        setIsRefreshing(true);
        if (chunks.length === 0) setIsLoading(true);
        try {
            const files: FileInfo[] = await invoke(CMD_SCAN_ZIP);
            const newChunks = files.map(fileInfoToChunk);
            cachedChunks = newChunks;
            setChunks(newChunks);
            logger.info('zip chunks fetched', newChunks.length);
        } catch (err) {
            logger.error(`Zip: failed to fetch chunks: ${String(err)}`);
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!cachedChunks) {
            fetchData();
        }
    }, []);

    const openChunk = async (chunk: Chunk) => {
        try {
            await invoke(CMD_OPEN_FILE, { path: chunk.path });
        } catch (err) {
            logger.error(`Zip: failed to open ${chunk.name}: ${String(err)}`);
        }
    };

    const togglePin = (id: string) => {
        const updated = chunks.map(c =>
            c.id === id ? { ...c, is_pinned: !c.is_pinned } : c
        );
        cachedChunks = updated;
        setChunks(updated);
    };

    return {
        title: 'Zip',
        searchQuery, setSearchQuery,
        isRefreshing, isLoading,
        fetchData,
        chunks,
        openChunk,
        togglePin,
    };
};
