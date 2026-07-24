import type { Chunk } from '../../../components/bazar/types/types';
import type { MiscSortMode } from "../../misc/types/types";

export const sortChunks = (chunks: Chunk[], mode: MiscSortMode): Chunk[] => {
    const pinned = chunks.filter(c => c.is_pinned);
    const rest = chunks.filter(c => !c.is_pinned);

    const sorted = [...rest].sort((a, b) => {
        switch (mode) {
            case 'name': return a.name.localeCompare(b.name, undefined, { numeric: true });
            case 'name-desc': return b.name.localeCompare(a.name, undefined, { numeric: true });
            case 'size': return (b.size ?? 0) - (a.size ?? 0);
            case 'size-asc': return (a.size ?? 0) - (b.size ?? 0);
            case 'type': return (a.ext ?? '').localeCompare(b.ext ?? '') || a.name.localeCompare(b.name, undefined, { numeric: true });
        }
    });

    return [...pinned, ...sorted];
};
