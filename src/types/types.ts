import type { ReactNode } from 'react';

export interface ItemData {
    id: string;
    title: string;
    subtitle: string;
    icon?: ReactNode;
    metadata?: string;
    size?: string;
    path?: string;
    is_dir?: boolean;
    is_pinned?: boolean;
}

export interface TabHook {
    title?: string;
    recentItems?: ItemData[];
    allItems?: ItemData[];
    searchQuery?: string;
    onCardClick?: (item: ItemData) => void;
    handleTogglePin?: (id: string) => void;
    selectedItem?: ItemData | null;
    setSelectedItem?: (item: ItemData | null) => void;
    getChildrens?: (item: ItemData) => Promise<ItemData[]>;
    onItemClick?: (item: ItemData) => void | Promise<void>;
    getRenderActions?: (item: ItemData) => ReactNode;
    defaultIcon?: ReactNode;
    handleRename?: (item: ItemData, newTitle: string) => Promise<void>;
}

export interface FileInfo {
    name: string,
    path: string,
    size: number,
    ext?: string,
    is_dir: boolean,
}
export interface ShowResult {
    id: string,
    title: string,
    get_title: string,
    num_episodes: number,
    episodes: FileInfo[],
    dir: string,
    is_banned?: boolean,
    is_pinned?: boolean,
}

export type ProjectType = "C/C++" | "Unknown";

export interface Project {
    title: string,
    path: string,
    project_type: ProjectType,
    is_pinned?: boolean,
}

