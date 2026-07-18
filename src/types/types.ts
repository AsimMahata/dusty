import type { ReactNode } from 'react';

export interface ActionItem {
    label: string;
    icon?: ReactNode;
    color?: string;
    onClick: () => void;
    separator?: boolean;
}


export type EpisodeStatus = "default" | "watched" | "unwatched";

export interface Episode {
    id: string;
    title: string;
    path: string;
    size?: string;
    rawSize?: number;
    episode_status?: EpisodeStatus;
}
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
    rawSize?: number;
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
    goBack?: () => void;
}

export interface FileInfo {
    id: string,
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
    mal_id?: number,
}

type ProjectType = "C/C++" | "Unknown";

export interface Project {
    id: string,
    title: string,
    path: string,
    project_type: ProjectType,
    pinned: boolean,
    status: ProjectStatus,
    tags?: string[],
    git_status?: string,
    git_branch?: string,
    cover_image?: string,
    logo?: string,
    last_opened?: string,
    last_modified?: string,
    last_scan?: string,
    description?: string,
    size?: string,
}

export type ProjectStatus = "default" | "active" | "working" | "paused" | "completed" | "on_hold" | "dropped" | "archived" | "broken";


export type TabType =
    | "normal"
    | "banned"
    | "media"
    | "folders"
    | "music"
    | "images"
    | "videos";

export interface Tab {
    title: string,
    type: TabType
}

export type MediaType = 'video' | 'music' | 'image';

export interface MediaDir {
    id: string,
    path: string,
    size?: number,
    media: FileInfo[],
    childs: MediaDir[],
    type?: MediaType
}
