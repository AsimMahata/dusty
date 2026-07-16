import type { Chunk, BazarAction } from '../../types/bazar';
import { PIN_ICON_16, ICONS } from '../../constants/icon';
import { PIN_COLOR } from '../../constants/color';
import { LABELS } from '../../constants/labels';

// Structural interface — any hook that provides these fields can use useBazarTab.
// This is what makes the Bazar layout reusable across ZIP, PDF, ISO, etc.
interface BazarSource {
    chunks: Chunk[];
    searchQuery: string;
    openChunk: (chunk: Chunk) => void;
    togglePin: (id: string) => void;
}

export const useBazarTab = (source: BazarSource) => {

    const visibleChunks = [...source.chunks]
        .filter(c => {
            if (!source.searchQuery) return true;
            return c.name.toLowerCase().includes(source.searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return a.name.localeCompare(b.name, undefined, { numeric: true });
        });

    const getChunkActions = (chunk: Chunk): BazarAction[] => [
        {
            label: LABELS.OPEN,
            icon: ICONS.GENERAL.EXTERNAL_LINK,
            onClick: () => source.openChunk(chunk),
        },
        {
            label: chunk.is_pinned ? LABELS.UNPIN : LABELS.PIN,
            icon: PIN_ICON_16,
            color: PIN_COLOR,
            onClick: () => source.togglePin(chunk.id),
        },
    ];

    return {
        visibleChunks,
        getChunkActions,
    };
};
