import type { ReactNode } from "react";
import type { ShowResult } from "./shows";

export interface MediaItem {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number;
  image: string;
}
export interface Episode {
    id: string;
    title: string;
    path: string;
    size?: string;
    rawSize?: number;
    episode_status?: EpisodeStatus;
}
export interface FileInfo {
    id: string,
    name: string,
    path: string,
    size: number,
    ext?: string,
    is_dir: boolean,
}
export interface MediaDir {
    id: string,
    path: string,
    size?: number,
    media: FileInfo[],
    childs: MediaDir[],
    type?: MediaType
}
export type EpisodeStatus = "default" | "watched" | "unwatched";
export type MediaType = 'video' | 'music' | 'image';
export interface VideoItem {
    show: ShowResult;
    episode: FileInfo;
}
export interface MediaSourceItem {
    id: string;
    title: string;
    subtitle?: string;
    path?: string;
    icon?: ReactNode;
    size?: string;
    rawSize?: number;
    metadata?: string;
    is_dir?: boolean;
}
export type MediaSourceCategory = 'video' | 'music' | 'image';
export type MediaSortMode = 'name' | 'name-desc' | 'size' | 'size-asc' | 'type';
export type MediaSortMethod = 'title' | 'updated' | 'random';










