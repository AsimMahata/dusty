import type { FileInfo } from "../../../types/core";

export type ShowType = "anime" | "movie_tv" | "unknown";

export interface ShowResult {
    id: string;
    title: string;
    get_title: string;
    num_episodes: number;
    episodes: FileInfo[];
    dir: string;
    banned: boolean;
    pinned: boolean;
    status: ShowStatus;
    season?: number;
    provider?: string;
    provider_id?: string;
    airing?: boolean;
    show_type?: ShowType;
    created_at?: string;
    updated_at?: string;
    raw_payload?: string;
    episodes_watched?: number;
}

export interface ShowInfo {
    title: string;
    status: string;
    banned: boolean;
    pinned: boolean;
    provider?: string;
    provider_id?: string;
    airing: boolean;
    show_type?: ShowType;
    created_at?: string;
    updated_at?: string;
}

export type ShowStatus =
    | "default"
    | "watching"
    | "completed"
    | "planned"
    | "on_hold"
    | "dropped";

export interface ShowTab {
    id: ShowTabStatus;
    label: string;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface ShowMetaData {
    posterUrl: string;
    bannerUrl: string;
    rating: number;
    totalEpisodes: number | string;
    nextEpisode: number | string;
    seasonYear: string;
    progress: number;
    statusColor: string;
}

export type ShowTabStatus = 'all' | ShowStatus | 'banned' | 'seasonal';
export type ShowSortMethod = 'title' | 'last_watched' | 'status' | 'random' | 'showId';

export interface ProviderSearchResult {
    title: string;
    provider_id: string;
    provider: string;
    year?: number | null;
    image_url?: string;
    show_type?: ShowType;
    num_episodes?: number | null;
    season?: number | null;
    airing?: boolean;
    raw_payload?: string;
}

export interface ScannedProviderResult extends ProviderSearchResult {
    priority: number;
    sourceQuery: string;
}

export const ApiProvider = {
    TENRAI: 'TENRAI',
    MAL: 'MAL',
    IMDB: 'IMDB',
    TMDB: 'TMDB',
    TVMAZE: 'TVMAZE',
    ANILIST: 'ANILIST',
} as const;

export type ApiProvider = (typeof ApiProvider)[keyof typeof ApiProvider];
