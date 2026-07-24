import { logger } from "../../utility/logger";
import type { AnimeData } from '../../pages/shows/types/types';
import { ApiProvider } from '../../pages/shows/types/types';

export const TENRAI_BASE_API = 'https://api.tenrai.org/v1';

export async function getSeasonalAnimeTENRAI(): Promise<{ data: AnimeData[]; source: typeof ApiProvider.TENRAI } | null> {
    try {
        const res = await fetch(`${TENRAI_BASE_API}/seasons/now`);
        if (!res.ok) {
            logger.error(`SEASONAL_ANIME_FROM_API_FAILED`, res);
            return null;
        }
        const json = await res.json();
        const data = json?.data || null;
        logger.info(`SEASONAL_ANIME_FROM_API_SUCESS`, data.length, data);
        const animeList: AnimeData[] = data.map((animePayLoad: any) => {
            const animeData: AnimeData = {
                title: animePayLoad.title_english || animePayLoad.title,
                mal_id: animePayLoad.mal_id,
                num_episodes: animePayLoad.episodes,
                season: findSeason(animePayLoad.title) || 1,
                airing: animePayLoad.airing || false,
                image_url: animePayLoad.images?.jpg?.image_url || animePayLoad.images?.webp?.image_url,
            };
            return animeData;
        });

        logger.info('SEASONAL_ANIME_API_PARSED', animeList.length, animeList);
        return {
            data: animeList,
            source: ApiProvider.TENRAI,
        };
    } catch (err) {
        logger.error(`SEASONAL_ANIME_FROM_API_FAILED`, err);
        return null;
    }
}

export async function searchAnimeTENRAI(query: string): Promise<{ data: AnimeData[]; source: typeof ApiProvider.TENRAI } | null> {
    try {
        const res = await fetch(`${TENRAI_BASE_API}/anime?q=${encodeURIComponent(query)}&limit=15`);
        if (!res.ok) {
            logger.error(`SEARCH_ANIME_FROM_API_FAILED`, res);
            return null;
        }
        const json = await res.json();
        const data = json?.data || null;
        logger.info(`SEARCH_ANIME_FROM_API_SUCCESS`, data?.length);

        if (!data) return { data: [], source: ApiProvider.TENRAI };

        const animeList: AnimeData[] = data.map((animePayLoad: any) => {
            const animeData: AnimeData = {
                title: animePayLoad.title_english || animePayLoad.title,
                mal_id: animePayLoad.mal_id,
                num_episodes: animePayLoad.episodes,
                season: findSeason(animePayLoad.title) || 1,
                airing: animePayLoad.airing || false,
                image_url: animePayLoad.images?.jpg?.image_url || animePayLoad.images?.webp?.image_url,
            };
            return animeData;
        });

        return {
            data: animeList,
            source: ApiProvider.TENRAI,
        };
    } catch (err) {
        logger.error(`SEARCH_ANIME_FROM_API_FAILED`, err);
        return null;
    }
}

export async function getAnimeInfoTENRAI(id: number): Promise<{ data: string; source: typeof ApiProvider.TENRAI } | null> {
    try {
        const res = await fetch(`${TENRAI_BASE_API}/anime/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch anime info for malId=${id}`);
        }
        const json = await res.json();
        const data = json?.data || null;
        logger.info(`MAL_INFO_FROM_API_SUCESS id ${id}`);
        if (!data) return null;
        return {
            data: JSON.stringify(data),
            source: ApiProvider.TENRAI,
        };
    } catch (err) {
        logger.error(`MAL_INFO_FROM_API_FAILED id ${id}`, err);
        return null;
    }
}

export function findSeason(title: string): number | null {
    const lowerTitle = title.toLowerCase();

    // Match "Season 2", "Season 10", etc.
    let match = lowerTitle.match(/season\s*(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }

    // Match "2nd Season", "4th Season", etc.
    match = lowerTitle.match(/(\d+)(?:st|nd|rd|th)\s*season/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }

    // Match Roman numerals "Season II", "Season IV", etc.
    match = lowerTitle.match(/season\s*([ivx]+)\b/);
    if (match && match[1]) {
        const romanMap: Record<string, number> = {
            'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
            'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
        };
        return romanMap[match[1]] || null;
    }

    return null;
}
