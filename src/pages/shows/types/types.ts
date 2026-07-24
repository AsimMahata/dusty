import type { FileInfo } from "../../../types/core";

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
    imdb_id?: string,
    airing?: boolean,
}
export interface ShowInfo {
    title: string,
    status: string,
    banned: boolean,
    pinned: boolean,
    mal_id?: number,
    airing: boolean,
}
export type ShowStatus =
    | "default"
    | "watching"
    | "completed"
    | "planned"
    | "on_hold"
    | "dropped";
export interface ShowTab {
    id: ShowTabStatus,
    label: string
}
export interface Coordinates {
    x: number,
    y: number
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
export type ShowSortMethod = 'title' | 'last_watched' | 'status' | 'random' | 'malId';
export interface AnimeData {
    title: string;
    mal_id: number;
    num_episodes: number | null;
    season: number | null;
    airing: boolean;
    image_url?: string;
}
export interface ScannedAnimeData extends AnimeData {
    priority: number;
    sourceQuery: string;
}
export interface ShowData {
    title: string;
    imdb_id: string;
    year: number | null;
    image_url?: string;
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












