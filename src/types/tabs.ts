import type { ReactNode } from "react";
import type { BaseItem, AnyItem, Item, ActionItem } from "./core";

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
export interface Tab {
    title: string,
    type: TabType
}
export type TabType =
    | "normal"
    | "banned"
    | "media"
    | "folders"
    | "music"
    | "images"
    | "videos";


