import { logger } from "../../../utility/logger";
import { searchShowTMDB } from "../../extroverts/tmdb";
import { addTvShowIPC, getAllTvShowsFromIPC } from "../../ambiverts/tv_show";
import { getCouplingValueBetweenQueryAndResultTitleIPC } from "../../ambiverts/utility";
import type { ShowData, ScannedShowData, ShowResult } from '../../../pages/shows/types/types';
import { getTvShowInfoFromTmdb, getMovieInfoFromTmdb } from "./metadata";

export async function saveSelectedShow(data: ShowData[]): Promise<boolean> {
    const success = await addTvShowIPC(data);
    if (success) {
        // Pre-cache metadata in the background
        for (const show of data) {
            try {
                if (show.show_type === 'movie') {
                    await getMovieInfoFromTmdb(show.imdb_id);
                } else {
                    await getTvShowInfoFromTmdb(show.imdb_id);
                }
            } catch (err) {
                logger.error(`Failed to pre-cache TMDB info for show ${show.imdb_id}: ${err}`);
            }
        }
    }
    return success;
}

export async function searchShow(query: string): Promise<ShowData[]> {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const res = await searchShowTMDB(query);
        const results = res?.data || null;
        if (!results || !Array.isArray(results)) return [];
        logger.info(`SEARCH_SHOW_FROM_API_RESULT`, results);
        return results.map((item: any) => {
            const title = item["#TITLE"] || item.name || item.title || '';
            const id = item["#IMDB_ID"] || (item.id ? item.id.toString() : '');
            const rawYear = item["#YEAR"] || (item.first_air_date ? item.first_air_date.substring(0, 4) : null) || (item.release_date ? item.release_date.substring(0, 4) : null);
            const year = rawYear ? parseInt(rawYear.toString(), 10) : null;
            const image_url = item["#IMG_POSTER"] || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '');
            const show_type = (item.media_type === 'movie' || item.release_date) ? 'movie' : 'tv_show';
            return {
                title,
                imdb_id: id,
                year,
                image_url,
                show_type
            };
        });
    } catch (e) {
        logger.error(`searchShow error: ${e}`);
        return [];
    }
}

export async function prefetchAllTvShowImdbIds(): Promise<Set<string>> {
    const allTvShows = await getAllTvShowsFromIPC();
    return new Set(allTvShows.map(t => t.imdb_id));
}

export async function scanShowsForTvShow(
    shows: ShowResult[],
    onProgress: (current: number, total: number) => void,
    onResultsUpdated: (results: ScannedShowData[]) => void,
    isMounted: () => boolean
): Promise<void> {
    // Filter to only scan shows that are unknown
    const showsToScan = shows.filter(s => s.show_type === 'unknown');

    if (showsToScan.length === 0) {
        return;
    }

    // Clean query and map to a custom object to sort by cleanQuery length
    const preparedShows = showsToScan.map(show => {
        // Remove leading "s1 ", "s2 ", etc.
        const cleanQuery = show.title.replace(/^s\d+\s+/i, '').trim();
        return { show, cleanQuery };
    }).sort((a, b) => a.cleanQuery.length - b.cleanQuery.length);

    const existingImdbIds = await prefetchAllTvShowImdbIds();
    const resultsMap = new Map<string, ScannedShowData>();

    for (let i = 0; i < preparedShows.length; i++) {
        if (!isMounted()) return;

        const { show, cleanQuery } = preparedShows[i];
        onProgress(i + 1, preparedShows.length);

        try {
            const results = await searchShow(cleanQuery);
            const filteredResults = results.filter(item => !existingImdbIds.has(item.imdb_id));
            const topResults = filteredResults.slice(0, 3);

            let updated = false;
            for (let index = 0; index < topResults.length; index++) {
                const item = topResults[index];

                // Fetch the similarity/coupling score from the backend utility API
                const coupling = await getCouplingValueBetweenQueryAndResultTitleIPC(item.title, cleanQuery) || 0;

                const prevPriority = index + 1;
                const newPriority = parseFloat((0.7 * (1 - coupling) + 0.3 * prevPriority).toFixed(2));

                if (!resultsMap.has(item.imdb_id)) {
                    resultsMap.set(item.imdb_id, {
                        ...item,
                        priority: newPriority,
                        sourceQuery: show.title
                    });
                    updated = true;
                } else {
                    const existing = resultsMap.get(item.imdb_id)!;
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
            logger.error(`Failed to search TV Show for ${show.title}: ${error}`);
        }

        if (i < preparedShows.length - 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
}
