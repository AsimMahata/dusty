import type { ActionItem } from './core';

// A Chunk represents a single miscellaneous file inside a Bazar.
export interface Chunk {
    id: string;
    name: string;
    path: string;
    ext?: string;
    size?: number;
    is_pinned?: boolean;
    tags?: string[];
    icon?: React.ReactNode;
}

// A BazarAction is what the owning Bazar provides to the Chunk.
// The Chunk renders whatever actions it receives — it does not decide them.
export type BazarAction = ActionItem;
