import { openFile } from '../../personalities/introverts/filesystem/filesystem';
import { useState } from 'react';
import type { useMisc } from './useMisc';
import type { Chunk } from '../../types/bazar';
import { logger } from '../../utility/logger';

// Adapts useMisc data to the BazarSource shape so ChunkList can render it.
// All data loading, filtering, and business logic stays in useMisc — untouched.
export const useMiscChunkTab = (misc: ReturnType<typeof useMisc>) => {
    const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

    const chunks: Chunk[] = misc.data.map(item => ({
        id: item.id,
        name: item.title,
        path: item.path ?? '',
        ext: undefined,
        size: undefined,
        is_pinned: pinnedIds.has(item.id),
    }));

    const openChunk = async (chunk: Chunk) => {
        try {
            await openFile(chunk.path);
        } catch (err) {
            logger.error(`Misc: failed to open ${chunk.name}: ${String(err)}`);
        }
    };

    const togglePin = (id: string) => {
        setPinnedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return {
        chunks,
        searchQuery: misc.searchQuery,
        openChunk,
        togglePin,
    };
};
