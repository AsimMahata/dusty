import type { ActionItem } from "../../../types/core";

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

export type BazarAction = ActionItem;
