import type { ReactNode } from "react";
import type { ProjectStatus } from '../pages/projects/types/types';
import type { ShowStatus } from '../pages/shows/types/types';
import type { ShowResult } from '../pages/shows/types/types';


export interface FileInfo {
    id: string,
    name: string,
    path: string,
    size: number,
    ext?: string,
    is_dir: boolean,
}

export interface ActionItem {
    label: string;
    icon?: ReactNode;
    color?: string;
    onClick: () => void;
    separator?: boolean;
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
export interface ItemCollection extends BaseItem {
    is_pinned?: boolean;
    status?: ItemStatus;
}
export interface Item extends BaseItem {
    size?: string;
    rawSize?: number;
}
export type ItemStatus = ShowStatus | ProjectStatus;
export type AnyItem = ItemCollection | Item;

export interface VideoItem {
    show: ShowResult;
    episode: FileInfo;
}





