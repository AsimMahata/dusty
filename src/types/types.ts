import type { ReactNode } from 'react';

export interface ActionItem {
    label: string;
    icon?: ReactNode;
    color?: string;
    onClick: () => void;
    separator?: boolean;
}


export type EpisodeStatus = "default" | "watched" | "unwatched";

export interface BaseItem {
    id: string;
    title: string;
    subtitle: string;
    icon?: ReactNode;
    metadata?: string;
    path?: string;
    is_dir?: boolean;
}

export type ItemStatus = ShowStatus | ProjectStatus;

export interface ItemCollection extends BaseItem {
    is_pinned?: boolean;
    status?: ItemStatus;
}

export interface Item extends BaseItem {
    size?: string;
    episode_status?: EpisodeStatus;
}

export type AnyItem = ItemCollection | Item;

export interface TabHook<T extends BaseItem = AnyItem> {
    title?: string;
    recentItems?: T[];
    allItems?: T[];
    searchQuery?: string;
    onCardClick?: (item: T) => void;
    handleTogglePin?: (id: string) => void;
    selectedItem?: T | null;
    setSelectedItem?: (item: T | null) => void;
    getChildrens?: (item: T) => Promise<Item[]>;
    onItemClick?: (item: Item) => void | Promise<void>;
    getRenderActions?: (item: T) => ReactNode;
    defaultIcon?: ReactNode;
    handleRename?: (item: T, newTitle: string) => Promise<void>;
    getCardActions?: (item: T) => ActionItem[];
}

export interface FileInfo {
    name: string,
    path: string,
    size: number,
    ext?: string,
    is_dir: boolean,
}

export type ShowStatus =
    | "default"
    | "watching"
    | "completed"
    | "planned"
    | "on_hold"
    | "dropped";

export interface ShowResult {
    id: string,
    title: string,
    get_title: string,
    num_episodes: number,
    episodes: FileInfo[],
    dir: string,
    banned: boolean,
    pinned: boolean,
    status: ShowStatus,
    season?: number,
}

export type ProjectType = "C/C++" | "Unknown";

export interface Project {
    id: string,
    title: string,
    path: string,
    project_type: ProjectType,
    pinned: boolean,
    status: ProjectStatus,
}

export type ProjectStatus = "default" | "working" | "completed" | "on_hold" | "dropped";

