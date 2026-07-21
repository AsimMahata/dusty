import { logger } from "../../../utility/logger";
import { getSeasonalAnimeAPI, searchAnimeAPI } from "../../extroverts/show/anime";
import { addSeasonalAnimeDB, getSeasonalAnimeFromDB, getAllAnimeFromDB } from "../../ambiverts/anime";
import type { ShowResult } from "../../../types/shows";
import type { AnimeData, ScannedAnimeData } from "../../../types/shows";

export async function addSeasonalAnime(): Promise<boolean> {
    try {
        let anime_list: AnimeData[] = await getSeasonalAnimeFromDB();
        if (anime_list && anime_list.length > 0) {
            logger.info('Seasonal anime already available in backend.');
            return true;
        }
        logger.info('Seasonal anime not available, fetching from API...');
        let data = await getSeasonalAnimeAPI();
        logger.info('Seasonal anime fetched from API.', data);
        if (data && data.length > 0) {
            return await addSeasonalAnimeDB(data);
        }
        logger.error('Failed to fetch seasonal anime from API or list is empty.');
        return false;
    } catch (e) {
        logger.error(`addSeasonalAnime error: ${e}`);
        return false;
    }
}

export async function searchAnime(query: string): Promise<AnimeData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const results = await searchAnimeAPI(query);
        return results || [];
    } catch (e) {
        logger.error(`searchAnime error: ${e}`);
        return [];
    }
}

export async function prefetchAllAnimeMalIds(): Promise<Set<number>> {
    const allAnime = await getAllAnimeFromDB();
    return new Set(allAnime.map(a => a.mal_id));
}

export async function scanShowsForAnime(
    shows: ShowResult[],
    onProgress: (current: number, total: number) => void,
    onResultsUpdated: (results: ScannedAnimeData[]) => void,
    isMounted: () => boolean
): Promise<void> {
    // Filter to only scan shows that DO NOT have a mal_id
    const showsToScan = shows.filter(s => !s.mal_id);

    if (showsToScan.length === 0) {
        return;
    }

    // Clean query and map to a custom object to sort by cleanQuery length
    const preparedShows = showsToScan.map(show => {
        // Remove leading "s1 ", "s2 ", etc.
        const cleanQuery = show.title.replace(/^s\d+\s+/i, '').trim();
        return { show, cleanQuery };
    }).sort((a, b) => a.cleanQuery.length - b.cleanQuery.length);

    const existingMalIds = await prefetchAllAnimeMalIds();
    const resultsMap = new Map<number, ScannedAnimeData>();

    for (let i = 0; i < preparedShows.length; i++) {
        if (!isMounted()) return;

        const { show, cleanQuery } = preparedShows[i];
        onProgress(i + 1, preparedShows.length);

        try {
            const results = await searchAnime(cleanQuery);
            const filteredResults = results.filter(anime => !existingMalIds.has(anime.mal_id));
            const topResults = filteredResults.slice(0, 3);

            let updated = false;
            topResults.forEach((anime, index) => {
                if (!resultsMap.has(anime.mal_id)) {
                    resultsMap.set(anime.mal_id, {
                        ...anime,
                        priority: index + 1,
                        sourceQuery: show.title
                    });
                    updated = true;
                } else {
                    const existing = resultsMap.get(anime.mal_id)!;
                    if (index + 1 < existing.priority) {
                        existing.priority = index + 1;
                        existing.sourceQuery = show.title;
                        updated = true;
                    }
                }
            });

            if (updated) {
                onResultsUpdated(Array.from(resultsMap.values()).sort((a, b) => a.priority - b.priority));
            }
        } catch (error) {
            logger.error(`Failed to search for ${show.title}: ${error}`);
        }

        if (i < preparedShows.length - 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
}
