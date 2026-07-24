import { logger } from "../../../utility/logger";
import { getSeasonalAnimeTENRAI, searchAnimeTENRAI } from "../../extroverts/tenrai";
import { addSeasonalAnimeIPC, getSeasonalAnimeFromIPC, getAllAnimeFromIPC } from "../../ambiverts/anime";
import { getCouplingValueBetweenQueryAndResultTitleIPC } from "../../ambiverts/utility";
import type { ShowResult } from '../../../pages/shows/types/types';
import type { AnimeData, ScannedAnimeData } from '../../../pages/shows/types/types';

export async function addSeasonalAnime(): Promise<boolean> {
    try {
        let anime_list: AnimeData[] = await getSeasonalAnimeFromIPC();
        if (anime_list && anime_list.length > 0) {
            logger.info('Seasonal anime already available in backend.');
            return true;
        }
        logger.info('Seasonal anime not available, fetching from API...');
        let res = await getSeasonalAnimeTENRAI();
        let data = res?.data || null;
        logger.info('Seasonal anime fetched from API.', data);
        if (data && data.length > 0) {
            return await addSeasonalAnimeIPC(data);
        }
        logger.error('Failed to fetch seasonal anime from API or list is empty.');
        return false;
    } catch (e) {
        logger.error(`addSeasonalAnime error: ${e}`);
        return false;
    }
}

export async function saveSelectedAnime(data: AnimeData[]): Promise<boolean> {
    return await addSeasonalAnimeIPC(data);
}

export async function searchAnime(query: string): Promise<AnimeData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const res = await searchAnimeTENRAI(query);
        return res?.data || [];
    } catch (e) {
        logger.error(`searchAnime error: ${e}`);
        return [];
    }
}

export async function prefetchAllAnimeMalIds(): Promise<Set<number>> {
    const allAnime = await getAllAnimeFromIPC();
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
            for (let index = 0; index < topResults.length; index++) {
                const anime = topResults[index];

                // Fetch the similarity/coupling score from the backend utility API
                const coupling = await getCouplingValueBetweenQueryAndResultTitleIPC(anime.title, cleanQuery) || 0;

                // Since coupling is similarity (1.0 is best, 0.0 is worst) and previous priority is rank (1 is best, 3 is worst),
                // we use (1 - coupling) to align their directions so that smaller combined values represent higher priority.
                const prevPriority = index + 1;
                const newPriority = parseFloat((0.7 * (1 - coupling) + 0.3 * prevPriority).toFixed(2));

                if (!resultsMap.has(anime.mal_id)) {
                    resultsMap.set(anime.mal_id, {
                        ...anime,
                        priority: newPriority,
                        sourceQuery: show.title
                    });
                    updated = true;
                } else {
                    const existing = resultsMap.get(anime.mal_id)!;
                    if (newPriority < existing.priority) {
                        existing.priority = newPriority;
                        existing.sourceQuery = show.title;
                        updated = true;
                    }
                }
            }

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
