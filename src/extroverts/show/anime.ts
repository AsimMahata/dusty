import type { AnimeData } from "../../introverts/show/anime";
import { logger } from "../../utility/logger";
import { API_BASE } from "./mal";


export async function getSeasonalAnimeAPI(): Promise<AnimeData[] | null> {

    try {
        const res = await fetch(`${API_BASE}/seasons/now`);
        if (!res.ok) {
            logger.error(`SEASONAL_ANIME_FROM_API_FAILED`,res);
            return null;
        }
        const json = await res.json();
        const data = json?.data || null;
        logger.info(`SEASONAL_ANIME_FROM_API_SUCESS`,data);
        const animeList: AnimeData[] = data.map((animePayLoad: any) => {
            const animeData: AnimeData = {
                title: animePayLoad.title_english || animePayLoad.title,
                mal_id: animePayLoad.mal_id,
                num_episodes: animePayLoad.episodes,
                season: findSeason(animePayLoad.title) || 1,
                seasonal: true,
            };
            return animeData;
        });
        logger.info('SEASONAL_ANIME_API_PARSED',animeList);
        return animeList;
    } catch (err) {
        logger.error(`SEASONAL_ANIME_FROM_API_FAILED`, err);
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